import NativeExpressionRepository from "@/repositories/NativeExpressionRepository";
import { Id, NativeExpressionModel } from "@kissnotes/types";

const findNativeExpression = async (
  id: Id,
): Promise<(NativeExpressionModel & { saves?: number }) | null> => {
  const expression = await NativeExpressionRepository.findOne({
    where: { id: id as number },
    loadRelationIds: { relations: ["saves"] },
  });

  if (!expression) return null;

  const result = expression as unknown as NativeExpressionModel & { saves?: number | unknown[] };

  if (result.saves && Array.isArray(result.saves)) {
    result.saves = result.saves.length;
  }

  return result as NativeExpressionModel & { saves?: number };
};

export default findNativeExpression;
