import ExpressionEntity from "@/entities/ExpressionEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";

const updateExpression = async (
  expression: ExpressionEntity,
): Promise<ExpressionEntity> => {
  const exists = await ExpressionRepository.exists({ where: expression });
  if (!exists) {
    throw ApiError("Expression doesn't exist.");
  }

  return await ExpressionRepository.save(expression);
};

export default updateExpression;
