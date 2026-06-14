import ExpressionEntity from "@/entities/ExpressionEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";
import type { ExpressionModel, Id } from "@kissnotes/types";

const findExpression = async (id: Id): Promise<ExpressionModel | null> => {
  const manager = ExpressionRepository.manager;
  const expression: ExpressionModel | null = await manager.findOne(
    ExpressionEntity,
    {
      where: { id: Number(id) },
      loadRelationIds: {
        relations: ["saves"],
      },
    },
  );

  if (!expression) return null;

  if (expression.saves && Array.isArray(expression.saves)) {
    expression.saves = expression?.saves?.length;
  }

  return expression;
};

export default findExpression;
