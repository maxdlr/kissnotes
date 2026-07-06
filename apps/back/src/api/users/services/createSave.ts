import SaveRepository from "@/repositories/SaveRepository";
import { Id } from "@kissnotes/types";

const createSave = async (expressionId: Id, userId: Id) => {
  const existing = await SaveRepository.exists({
    where: {
      expression: { id: expressionId as number },
      user: { id: userId as number },
    },
  });

  if (existing) {
    await SaveRepository.delete({
      expression: { id: expressionId as number },
      user: { id: userId as number },
    });
    return null;
  }

  const relation = {
    expression: { id: expressionId as number },
    user: { id: userId as number },
  };
  const save = await SaveRepository.save(relation);
  return save;
};
export default createSave;
