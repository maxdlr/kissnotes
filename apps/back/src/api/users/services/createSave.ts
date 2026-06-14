import SaveRepository from "@/repositories/SaveRepository";
import { Id } from "@kissnotes/types";

const createSave = async (expressionId: Id, userId: Id) => {
  const exists = await SaveRepository.exists({
    where: {
      expression: { id: expressionId as number },
      user: { id: userId as number },
    },
  });

  if (exists) {
    throw ApiError("Save already exists");
  }

  const relation = {
    expression: { id: expressionId as number },
    user: { id: userId as number },
  };
  const save = await SaveRepository.save(relation);
  return save;
};
export default createSave;
