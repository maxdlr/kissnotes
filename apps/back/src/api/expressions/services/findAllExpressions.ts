import ExpressionEntity from "@/entities/ExpressionEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";
import { ExpressionSymbol } from "@kissnotes/types";
import { FindOptionsWhere } from "typeorm";
import filterBySearch from "./filterBySearch";
import filterByTokens from "./filterByTokens";

interface ExtendedWhere extends FindOptionsWhere<ExpressionEntity> {
  search?: string;
}

const findAllExpressions = async (
  where?: ExtendedWhere,
): Promise<ExpressionEntity[]> => {
  if (!where) {
    return ExpressionRepository.find();
  }

  const symbolsFilter = where.symbols;
  const tokenTitles: string[] | undefined =
    symbolsFilter &&
    typeof symbolsFilter === "object" &&
    "tokens" in symbolsFilter &&
    Array.isArray((symbolsFilter as ExpressionSymbol).tokens)
      ? (symbolsFilter as ExpressionSymbol).tokens.map(String)
      : undefined;

  const { search, ...sanitizedWhere } = where;

  let result = await ExpressionRepository.findBy(
    sanitizedWhere as FindOptionsWhere<ExpressionEntity>,
  );

  if (tokenTitles) {
    result = filterByTokens(result, tokenTitles);
  }

  if (search) {
    result = filterBySearch(result, search);
  }

  return result;
};

export default findAllExpressions;
