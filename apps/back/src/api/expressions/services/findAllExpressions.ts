import ExpressionEntity from "@/entities/ExpressionEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";

const findAllExpressions = async (where?: any): Promise<ExpressionEntity[]> => {
  const expressions = await ExpressionRepository.findBy(where);
  return expressions;
};

export default findAllExpressions;
