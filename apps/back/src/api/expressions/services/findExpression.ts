import ExpressionEntity from "@/entities/ExpressionEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";
import { Id } from "@kissnotes/types";

const findExpression = async (id: Id): Promise<ExpressionEntity | null> => {
  return await ExpressionRepository.findOneBy({ id });
};

export default findExpression;
