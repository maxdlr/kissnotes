import NativeExpressionEntity from "@/entities/NativeExpressionEntity";
import NativeExpressionRepository from "@/repositories/NativeExpressionRepository";

const createNativeExpression = async (
  nativeExpression: NativeExpressionEntity,
): Promise<NativeExpressionEntity> => {
  return await NativeExpressionRepository.save(nativeExpression);
};

export default createNativeExpression;
