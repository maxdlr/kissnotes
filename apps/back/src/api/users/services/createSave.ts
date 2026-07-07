import SaveRepository from "@/repositories/SaveRepository";
import { Id } from "@kissnotes/types";

interface CreateSaveParams {
  expressionId?: Id;
  nativeExpressionId?: Id;
  userId: Id;
}

/**
 * Creates or removes a save for an expression or native expression.
 * Acts as a toggle: if the save already exists, it is removed.
 *
 * @param params - The save parameters (one of expressionId or nativeExpressionId must be set)
 * @returns The created save entity, or null if the save was removed
 */
const createSave = async ({ expressionId, nativeExpressionId, userId }: CreateSaveParams) => {
  const where = expressionId
    ? { expression: { id: expressionId as number }, user: { id: userId as number } }
    : { nativeExpression: { id: nativeExpressionId as number }, user: { id: userId as number } };

  const existing = await SaveRepository.exists({ where });

  if (existing) {
    await SaveRepository.delete(where);
    return null;
  }

  const relation = expressionId
    ? { expression: { id: expressionId as number }, user: { id: userId as number } }
    : { nativeExpression: { id: nativeExpressionId as number }, user: { id: userId as number } };

  const save = await SaveRepository.save(relation);
  return save;
};

export default createSave;
