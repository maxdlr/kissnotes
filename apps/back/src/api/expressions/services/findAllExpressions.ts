import ExpressionEntity from "@/entities/ExpressionEntity";
import NativeExpressionEntity from "@/entities/NativeExpressionEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";
import { parseAeExpression } from "./parseAeExpressions";

const findAllExpressions = async (where?: any): Promise<ExpressionEntity[]> => {
  const manager = ExpressionRepository.manager;

  const [expressions, nativeExpressions] = await Promise.all([
    manager.findBy(ExpressionEntity, where),
    manager.find(NativeExpressionEntity),
  ]);

  return expressions.map((e) => ({
    ...e,
    symbols: parseAeExpression(e.code, nativeExpressions),
  }));
};

export default findAllExpressions;
