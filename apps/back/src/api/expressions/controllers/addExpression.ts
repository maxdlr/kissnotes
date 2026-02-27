import { TryCatch } from "@/decorators/TryCatch";
import { ExpressionModel } from "@kissnotes/types";
import { NextFunction, Request, Response } from "express";
import createExpression from "../services/createExpression";
import ExpressionEntity from "@/entities/ExpressionEntity";

const addExpression = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response<ExpressionModel>> => {
  const expression = req.body.expression;

  if (!expression) {
    throw ApiError("Expression missing");
  }

  const createdExpression: ExpressionEntity =
    await createExpression(expression);

  return res.status(200).send(createdExpression);
};

export default TryCatch(addExpression);
