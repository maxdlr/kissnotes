import doesUserExist from "@/api/users/services/doesUserExist";
import ExpressionEntity from "@/entities/ExpressionEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";

const createExpression = async (
  expression: ExpressionEntity,
): Promise<ExpressionEntity> => {
  const userExists = await doesUserExist(expression.user.id);
  if (!userExists) {
    throw ApiError("Expression user doesn't exist.");
  }
  return await ExpressionRepository.save(expression);
};

export default createExpression;
