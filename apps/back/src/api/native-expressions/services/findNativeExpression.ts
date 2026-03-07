import NativeExpressionEntity from "@/entities/NativeExpressionEntity";
import NativeExpressionRepository from "@/repositories/NativeExpressionRepository";
import { Id } from "@kissnotes/types";

const findNativeExpression = async (
  id: Id,
): Promise<NativeExpressionEntity | null> => {
  return await NativeExpressionRepository.findOneBy({ id });
};

export default findNativeExpression;
