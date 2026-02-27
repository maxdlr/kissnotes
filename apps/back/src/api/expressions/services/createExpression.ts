import ExpressionEntity from "@/entities/ExpressionEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";

const createExpression = async (
  expression: ExpressionEntity,
): Promise<ExpressionEntity> => {
  return await ExpressionRepository.save(expression);
};

export default createExpression;
