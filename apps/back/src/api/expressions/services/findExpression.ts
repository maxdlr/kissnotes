import ExpressionEntity from "@/entities/ExpressionEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";
import type { Id } from "@kissnotes/types";

const findExpression = async (id: Id): Promise<ExpressionEntity | null> => {
  const manager = ExpressionRepository.manager;
  const expression = await manager.findOneBy(ExpressionEntity, {
    id: Number(id),
  });

  if (!expression) return null;
  return expression;
};

export default findExpression;
