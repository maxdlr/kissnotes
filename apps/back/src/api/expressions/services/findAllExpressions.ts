import ExpressionEntity from "@/entities/ExpressionEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";
import { ExpressionSymbol } from "@kissnotes/types";
import { FindOptionsWhere } from "typeorm";
import filterByTokens from "./filterByTokens";

interface ExtendedWhere extends FindOptionsWhere<ExpressionEntity> {
  search?: string;
  maxResults?: number | string;
}

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

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { search, maxResults, symbols, ...sanitizedWhere } = where;
  const take: number = maxResults ? Number(maxResults) : 50;

  if (search) {
    const baseWhere = sanitizedWhere as FindOptionsWhere<ExpressionEntity>;
    const qb = ExpressionRepository.createQueryBuilder("expression")
      .leftJoinAndSelect("expression.author", "author")
      .where(baseWhere);

    const searchWords = search.split(/\s+/).filter(Boolean);
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
    where: sanitizedWhere as FindOptionsWhere<ExpressionEntity>,
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
