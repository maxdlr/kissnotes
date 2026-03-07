import NativeExpressionEntity from "@/entities/NativeExpressionEntity";
import NativeExpressionRepository from "@/repositories/NativeExpressionRepository";

const updateNativeExpression = async (
  expression: NativeExpressionEntity,
): Promise<NativeExpressionEntity> => {
  const exists = await NativeExpressionRepository.exists({ where: expression });
  if (!exists) {
    throw ApiError("NativeExpression doesn't exist.");
  }

  return await NativeExpressionRepository.save(expression);
};

export default updateNativeExpression;
