import type { Id } from "@kissnotes/types";
import ExpressionEntity from "@/entities/ExpressionEntity";
import NativeExpressionEntity from "@/entities/NativeExpressionEntity";
import ExpressionRepository from "@/repositories/ExpressionRepository";
import { parseAeExpression } from "./parseAeExpressions";

const findExpression = async (id: Id): Promise<ExpressionEntity | null> => {
	const manager = ExpressionRepository.manager;
	const [expression, nativeExpressions] = await Promise.all([
		manager.findOneBy(ExpressionEntity, { id: Number(id) }),
		manager.find(NativeExpressionEntity),
	]);
	if (!expression) return null;
	return {
		...expression,
		symbols: parseAeExpression(expression.code, nativeExpressions),
	};
};

export default findExpression;
