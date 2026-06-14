import ExpressionEntity from "@/entities/ExpressionEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";
import { Id } from "@kissnotes/types";

const createExpression = async (
  userId: Id,
  expression: ExpressionEntity,
): Promise<ExpressionEntity> => {
  expression.author = { id: userId } as any;
  return await ExpressionRepository.save(expression);
};

export default createExpression;
