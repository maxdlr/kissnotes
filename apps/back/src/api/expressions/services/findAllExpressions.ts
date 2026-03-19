import ExpressionEntity from "@/entities/ExpressionEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";
import { ExpressionSymbol } from "@kissnotes/types";
import { FindOptionsWhere } from "typeorm";

const findAllExpressions = async (
  where?: FindOptionsWhere<ExpressionEntity>,
): Promise<ExpressionEntity[]> => {
  if (!where) {
    return await ExpressionRepository.find();
  }

  const tokenFilter = (where.symbols as ExpressionSymbol)?.tokens.map(Number);

  if (tokenFilter) {
    delete where.symbols;
  }

  const collection = await ExpressionRepository.findBy(where);

  if (tokenFilter) {
    return collection.filter((expression) =>
      expression.symbols?.tokens
        .map((t) => t.id)
        .some((t) => tokenFilter.includes(t)),
    );
  }

  return collection;
};

export default findAllExpressions;
