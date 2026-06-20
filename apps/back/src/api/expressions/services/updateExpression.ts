import ExpressionEntity from "@/entities/ExpressionEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";

const updateExpression = async (
  expression: ExpressionEntity,
): Promise<ExpressionEntity> => {
  const exists = await ExpressionRepository.exists({
    where: { id: expression.id },
  });

  if (!exists) {
    throw ApiError("Expression doesn't exist.");
  }

  const { saves, author, ...updatableFields } = expression as any;

  return await ExpressionRepository.save(updatableFields);
};

export default updateExpression;
