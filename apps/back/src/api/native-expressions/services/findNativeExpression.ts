import NativeExpressionEntity from "@/entities/NativeExpressionEntity";
import NativeExpressionRepository from "@/repositories/NativeExpressionRepository";
import { Id } from "@kissnotes/types";

const findNativeExpression = async (
  id: Id,
): Promise<NativeExpressionEntity | null> => {
  return await NativeExpressionRepository.findOne({
    where: { id: id as number },
    loadRelationIds: { relations: ["saves"] },
  });
};

export default findNativeExpression;
