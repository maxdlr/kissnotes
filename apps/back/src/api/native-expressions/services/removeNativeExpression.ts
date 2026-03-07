import NativeExpressionRepository from "@/repositories/NativeExpressionRepository";

const removeNativeExpression = async (where: any) => {
  const exists = await NativeExpressionRepository.exists({ where });
  if (!exists) {
    throw ApiError("NativeExpression doesn't exist.");
  }
  return await NativeExpressionRepository.delete(where);
};

export default removeNativeExpression;
