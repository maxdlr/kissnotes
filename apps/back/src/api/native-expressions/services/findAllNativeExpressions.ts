import NativeExpressionEntity from "@/entities/NativeExpressionEntity";
import NativeExpressionRepository from "@/repositories/NativeExpressionRepository";

const findAllNativeExpressions = async (
  where?: any,
): Promise<NativeExpressionEntity[]> => {
  return await NativeExpressionRepository.findBy(where);
};

export default findAllNativeExpressions;
