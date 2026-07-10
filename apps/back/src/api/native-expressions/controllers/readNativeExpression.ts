import { NativeExpressionModel } from "@kissnotes/types";
import { Request, Response } from "express";
import findNativeExpression from "../services/findNativeExpression";

type Type = NativeExpressionModel & {
  native?: boolean;
  author?: { username: string };
};

const readNativeExpression = async (
  req: Request,
  res: Response,
): Promise<Response<Type>> => {
  const { id } = req.query;
  if (!id) {
    throw ApiError("Id missing");
  }
  const expression: Type | null = await findNativeExpression(Number(id));

  if (!expression) {
    throw Missing("Expression not found");
  }

  expression.native = true;
  expression.author = { username: "After Effects" };

  return res.status(200).send(expression);
};
export default readNativeExpression;
