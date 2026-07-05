import ExpressionEntity from "@/entities/ExpressionEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";
import { ExpressionSymbol } from "@kissnotes/types";
import { FindOptionsWhere } from "typeorm";
import filterByTokens from "./filterByTokens";

interface ExtendedWhere extends FindOptionsWhere<ExpressionEntity> {
  search?: string;
  maxResults?: number | string;
}

/**
 * Builds a TypeORM WHERE clause from only the allowed filter fields.
 * Allowed: `published` (boolean), `author` (object with `id`).
 */
const buildWhitelistedWhere = (
  where: ExtendedWhere,
): FindOptionsWhere<ExpressionEntity> => {
  const allowed: FindOptionsWhere<ExpressionEntity> = {};

  if (typeof where.published === "boolean") {
    allowed.published = where.published;
  }

  if (
    where.author &&
    typeof where.author === "object" &&
    "id" in where.author
  ) {
    allowed.author = { id: (where.author as { id: number }).id };
  }

  return allowed;
};

const findAllExpressions = async (
  where?: ExtendedWhere,
): Promise<ExpressionEntity[]> => {
  if (!where) {
    console.log(
      "findAllExpressions called with no where clause, returning all expressions",
    );

    return ExpressionRepository.find({});
  }

  const symbolsFilter = where.symbols;
  const tokenTitles: string[] | undefined =
    symbolsFilter &&
    typeof symbolsFilter === "object" &&
    "tokens" in symbolsFilter &&
    Array.isArray((symbolsFilter as ExpressionSymbol).tokens)
      ? (symbolsFilter as ExpressionSymbol).tokens.map(String)
      : undefined;

  const sanitizedWhere = buildWhitelistedWhere(where);
  const take: number = where.maxResults ? Number(where.maxResults) : 50;

  if (where.search) {
    const qb = ExpressionRepository.createQueryBuilder("expression")
      .leftJoinAndSelect("expression.author", "author")
      .where(sanitizedWhere);

    const searchWords = where.search.split(/\s+/).filter(Boolean);
    searchWords.forEach((searchWord, i) => {
      const param = `search${i}`;
      qb.andWhere(
        `(
expression.title LIKE :${param} 
OR expression.description LIKE :${param} 
OR CAST(expression.code AS CHAR) LIKE :${param} 
OR author.username LIKE :${param}
)`,
        { [param]: `%${searchWord}%` },
      );
    });

    let result = await qb.take(take).getMany();

    if (tokenTitles) {
      result = filterByTokens(result, tokenTitles);
    }

    return result;
  }

  let result = await ExpressionRepository.find({
    where: sanitizedWhere,
    ...(take && !tokenTitles ? { take } : {}),
    loadRelationIds: { relations: ["saves"] },
  });

  if (tokenTitles) {
    result = filterByTokens(result, tokenTitles);
    if (take) result = result.slice(0, take);
  }

  return result;
};

export default findAllExpressions;
