import NativeExpressionEntity from "@/entities/NativeExpressionEntity";
import NativeExpressionRepository from "@/repositories/NativeExpressionRepository";

const findAllNativeExpressions = async (
  where?: any,
): Promise<NativeExpressionEntity[]> => {
  const { search, maxResults, symbols, ...sanitizedWhere } = where;
  return await NativeExpressionRepository.findBy(sanitizedWhere);
};

export default findAllNativeExpressions;
