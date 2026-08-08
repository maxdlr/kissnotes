import type { ExpressionModel } from "@kissnotes/types";
import type { Request, Response } from "express";
import findExpression from "../services/findExpression";

const readExpression = async (
	req: Request,
	res: Response,
): Promise<Response<ExpressionModel>> => {
	const { id } = req.query;
	if (!id) {
		throw ApiError("Id missing");
	}
	const expression = await findExpression(id as string);

	if (!expression) {
		throw Missing("Expression not found");
	}

	return res.status(200).send(expression);
};
export default readExpression;
