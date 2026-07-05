import ExpressionRepository from "@/repositories/ExpressionRepository";
import NativeExpressionRepository from "@/repositories/NativeExpressionRepository";
import SaveRepository from "@/repositories/SaveRepository";
import ExpressionEntity from "@/entities/ExpressionEntity";
import NativeExpressionEntity from "@/entities/NativeExpressionEntity";

export type BrowseMode = "all" | "mine" | "saved" | "native";

export interface BrowseParams {
  mode: BrowseMode;
  search?: string;
  tokens?: string[];
  authorId?: number;
  userId?: number;
  maxResults?: number;
}

export interface BrowseResult {
  id: number;
  title: string;
  description?: string;
  code: unknown;
  layer?: unknown;
  property?: unknown;
  symbols?: unknown;
  author?: { id: number; username: string };
  views?: number;
  createdAt?: Date;
  native: boolean;
  score: number;
}

/**
 * Computes a relevance score for a result based on how many search words
 * match in each field, weighted by field importance.
 */
const computeScore = (
  searchWords: string[],
  title: string,
  description: string,
  code: string,
  author: string,
): number => {
  if (!searchWords.length) return 0;
  let score = 0;
  const t = title.toLowerCase();
  const d = description.toLowerCase();
  const c = code.toLowerCase();
  const a = author.toLowerCase();

  for (const word of searchWords) {
    if (t.includes(word)) score += 4;
    if (d.includes(word)) score += 2;
    if (a.includes(word)) score += 2;
    if (c.includes(word)) score += 1;
  }

  return score;
};

/**
 * Filters expressions where every token title in the list
 * is present in expression.symbols.tokens.
 */
const filterByTokens = (
  collection: ExpressionEntity[],
  tokenTitles: string[],
): ExpressionEntity[] => {
  if (!tokenTitles.length) return collection;
  return collection.filter((expression) =>
    tokenTitles.every((title) =>
      expression.symbols?.tokens.some((t) =>
        typeof t === "string" ? title === t : title === t.title,
      ),
    ),
  );
};

/**
 * Applies text search conditions to a query builder.
 */
const applySearch = (
  qb: { andWhere: (condition: string, params: Record<string, string>) => void },
  searchWords: string[],
  includeAuthor: boolean,
) => {
  searchWords.forEach((word, i) => {
    const param = `search${i}`;
    const authorClause = includeAuthor
      ? `OR author.username LIKE :${param}`
      : "";
    qb.andWhere(
      `(expression.title LIKE :${param} OR expression.description LIKE :${param} OR CAST(expression.code AS CHAR) LIKE :${param} ${authorClause})`,
      { [param]: `%${word}%` },
    );
  });
};

/**
 * Maps an ExpressionEntity to a normalized BrowseResult.
 */
const mapExpression = (
  e: ExpressionEntity,
  searchWords: string[],
): BrowseResult => ({
  id: e.id,
  title: e.title,
  description: e.description,
  code: e.code,
  layer: e.layer,
  property: e.property,
  symbols: e.symbols,
  author: e.author ? { id: e.author.id, username: e.author.username } : undefined,
  views: e.views,
  createdAt: e.createdAt,
  native: false,
  score: computeScore(
    searchWords,
    e.title || "",
    e.description || "",
    JSON.stringify(e.code || ""),
    e.author?.username || "",
  ),
});

/**
 * Maps a NativeExpressionEntity to a normalized BrowseResult.
 */
const mapNativeExpression = (
  ne: NativeExpressionEntity,
  searchWords: string[],
): BrowseResult => ({
  id: ne.id,
  title: ne.title,
  description: ne.description,
  code: ne.code,
  native: true,
  score: computeScore(
    searchWords,
    ne.title || "",
    ne.description || "",
    JSON.stringify(ne.code || ""),
    "",
  ),
});

/**
 * Fetches published expressions with optional search and author filter.
 */
const fetchExpressions = async (
  searchWords: string[],
  authorId?: number,
  take?: number,
): Promise<ExpressionEntity[]> => {
  const qb = ExpressionRepository.createQueryBuilder("expression")
    .leftJoinAndSelect("expression.author", "author")
    .where("expression.published = :published", { published: true });

  if (authorId) {
    qb.andWhere("author.id = :authorId", { authorId });
  }

  if (searchWords.length) {
    applySearch(qb, searchWords, true);
  } else {
    qb.orderBy("expression.createdAt", "DESC");
  }

  if (take) qb.take(take);
  return qb.getMany();
};

/**
 * Fetches native expressions with optional search.
 */
const fetchNativeExpressions = async (
  searchWords: string[],
  take?: number,
): Promise<NativeExpressionEntity[]> => {
  const qb = NativeExpressionRepository.createQueryBuilder("expression");

  if (searchWords.length) {
    applySearch(qb, searchWords, false);
  }

  if (take) qb.take(take);
  return qb.getMany();
};

/**
 * Fetches expressions saved by a specific user.
 */
const fetchSavedExpressions = async (
  userId: number,
  searchWords: string[],
  take?: number,
): Promise<ExpressionEntity[]> => {
  const saves = await SaveRepository.find({
    where: { user: { id: userId } },
    relations: ["expression", "expression.author"],
  });

  let expressions = saves
    .map((s) => s.expression)
    .filter((e): e is ExpressionEntity => !!e);

  if (searchWords.length) {
    expressions = expressions.filter((e) => {
      const text = [
        e.title,
        e.description,
        JSON.stringify(e.code || ""),
        e.author?.username || "",
      ]
        .join(" ")
        .toLowerCase();
      return searchWords.every((w) => text.includes(w));
    });
  }

  if (take) expressions = expressions.slice(0, take);
  return expressions;
};

/**
 * Unified browse endpoint for all expression list modes.
 * Accepts a mode and filters, returns a normalized sorted result set.
 *
 * @param params - Browse parameters including mode, search, tokens, authorId, userId
 * @returns Sorted array of normalized browse results
 */
const searchAll = async (params: BrowseParams): Promise<BrowseResult[]> => {
  const { mode, search, tokens = [], authorId, userId, maxResults } = params;
  const take = maxResults || 50;
  const searchWords = (search || "").toLowerCase().split(/\s+/).filter(Boolean);

  switch (mode) {
    case "native": {
      const nativeExpressions = await fetchNativeExpressions(searchWords, take);
      return nativeExpressions
        .filter((ne) => !!ne.code)
        .map((ne) => mapNativeExpression(ne, searchWords))
        .sort((a, b) => b.score - a.score);
    }

    case "mine": {
      if (!authorId) return [];
      let expressions = await fetchExpressions(searchWords, authorId, take);
      expressions = filterByTokens(expressions, tokens);
      return expressions
        .map((e) => mapExpression(e, searchWords))
        .sort((a, b) => b.score - a.score);
    }

    case "saved": {
      if (!userId) return [];
      let expressions = await fetchSavedExpressions(userId, searchWords, take);
      expressions = filterByTokens(expressions, tokens);
      return expressions
        .map((e) => mapExpression(e, searchWords))
        .sort((a, b) => b.score - a.score);
    }

    case "all":
    default: {
      const [expressions, nativeExpressions] = await Promise.all([
        fetchExpressions(searchWords, authorId),
        fetchNativeExpressions(searchWords),
      ]);

      const filteredExpressions = filterByTokens(expressions, tokens);

      const scoredExpressions = filteredExpressions.map((e) =>
        mapExpression(e, searchWords),
      );
      const scoredNative = nativeExpressions
        .filter((ne) => !!ne.code)
        .map((ne) => mapNativeExpression(ne, searchWords));

      return [...scoredExpressions, ...scoredNative]
        .sort((a, b) => b.score - a.score)
        .slice(0, take);
    }
  }
};

export default searchAll;
