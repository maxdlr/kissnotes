import findUser from "@/api/users/services/findUser";
import ExpressionEntity from "@/entities/ExpressionEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";
import { Id } from "@kissnotes/types";

const createExpression = async (
  userId: Id,
  expression: ExpressionEntity,
): Promise<ExpressionEntity> => {
  const user = await findUser({ id: userId as number });
  if (!user) {
    throw ApiError("Expression user doesn't exist.");
  }

  const newExpression = new ExpressionEntity();
  newExpression.title = expression.title;
  newExpression.author = user;

  return await ExpressionRepository.save(expression);
};

export default createExpression;
