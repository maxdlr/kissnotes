import ExpressionRepository from "@/repositories/ExpressionRepository";
import NativeExpressionRepository from "@/repositories/NativeExpressionRepository";
import ExpressionEntity from "@/entities/ExpressionEntity";
import NativeExpressionEntity from "@/entities/NativeExpressionEntity";

interface SearchResult {
  id: number;
  title: string;
  description?: string;
  code: any;
  layer?: any;
  property?: any;
  symbols?: any;
  author: { username: string };
  views?: number;
  createdAt?: Date;
  native: boolean;
  score: number;
}

interface SearchParams {
  search: string;
  maxResults?: number | string;
}

/**
 * Computes a relevance score for a result based on how many search words
 * match in each field, weighted by field importance.
 *
 * @param searchWords - Lowercased search terms
 * @param title - Result title
 * @param description - Result description
 * @param code - Stringified code content
 * @param author - Author username
 * @returns Numeric relevance score (higher = more relevant)
 */
const computeScore = (
  searchWords: string[],
  title: string,
  description: string,
  code: string,
  author: string,
): number => {
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
 * Searches both expressions and native-expressions tables,
 * scores each result by relevance, and returns a merged sorted list.
 * When no search query is provided, returns the most recent expressions.
 *
 * @param params - Search parameters including the search query and optional max results
 * @returns Sorted array of search results, highest score first (or most recent first if no query)
 */
const searchAll = async (params: SearchParams): Promise<SearchResult[]> => {
  const { search, maxResults } = params;
  const take = maxResults ? Number(maxResults) : 30;
  const searchWords = (search || "").toLowerCase().split(/\s+/).filter(Boolean);

  if (!searchWords.length) {
    const recent = await ExpressionRepository.find({
      where: { published: true },
      relations: ["author"],
      order: { createdAt: "DESC" },
      take,
    });

    return recent.map((e: ExpressionEntity) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      code: e.code,
      layer: e.layer,
      property: e.property,
      symbols: e.symbols,
      author: { username: e.author?.username },
      views: e.views,
      createdAt: e.createdAt,
      native: false,
      score: 0,
    }));
  }

  const expressionQb = ExpressionRepository.createQueryBuilder("expression")
    .leftJoinAndSelect("expression.author", "author")
    .where("expression.published = :published", { published: true });

  searchWords.forEach((word, i) => {
    const param = `search${i}`;
    expressionQb.andWhere(
      `(
expression.title LIKE :${param} 
OR expression.description LIKE :${param} 
OR CAST(expression.code AS CHAR) LIKE :${param} 
OR author.username LIKE :${param}
)`,
      { [param]: `%${word}%` },
    );
  });

  const nativeQb =
    NativeExpressionRepository.createQueryBuilder("expression");

  searchWords.forEach((word, i) => {
    const param = `search${i}`;
    nativeQb.andWhere(
      `(
expression.title LIKE :${param} 
OR expression.description LIKE :${param} 
OR CAST(expression.code AS CHAR) LIKE :${param}
)`,
      { [param]: `%${word}%` },
    );
  });

  const [expressions, nativeExpressions] = await Promise.all([
    expressionQb.getMany(),
    nativeQb.getMany(),
  ]);

  const scoredExpressions: SearchResult[] = expressions.map(
    (e: ExpressionEntity) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      code: e.code,
      layer: e.layer,
      property: e.property,
      symbols: e.symbols,
      author: { username: e.author?.username },
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
    }),
  );

  const scoredNative: SearchResult[] = nativeExpressions.map(
    (ne: NativeExpressionEntity) => ({
      id: ne.id,
      title: ne.title,
      description: ne.description,
      code: ne.code,
      author: { username: "After Effects" },
      native: true,
      score: computeScore(
        searchWords,
        ne.title || "",
        ne.description || "",
        JSON.stringify(ne.code || ""),
        "After Effects",
      ),
    }),
  );

  return [...scoredExpressions, ...scoredNative]
    .sort((a, b) => b.score - a.score)
    .slice(0, take);
};

export default searchAll;
