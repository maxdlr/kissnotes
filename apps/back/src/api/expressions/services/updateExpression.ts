import ExpressionEntity from "@/entities/ExpressionEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";

const updateExpression = async (
  expression: ExpressionEntity,
): Promise<ExpressionEntity> => {
  const existingExpression = await ExpressionRepository.exists({
    where: { id: expression.id },
  });

  if (!existingExpression) {
    throw ApiError("Expression doesn't exist.");
  }

  const { saves: _saves, ...updatableFields } = expression as any;

  return await ExpressionRepository.save(updatableFields);
};

export default updateExpression;
