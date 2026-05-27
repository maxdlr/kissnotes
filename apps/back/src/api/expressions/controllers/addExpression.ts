import { TryCatch } from "@/decorators/TryCatch";
import { ExpressionModel } from "@kissnotes/types";
import { NextFunction, Request, Response } from "express";
import createExpression from "../services/createExpression";
import ExpressionEntity from "@/entities/ExpressionEntity";

const addExpression = async (
  { user, body }: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response<ExpressionModel>> => {
  const expression = body.expression;

  if (!user) {
    throw Unauthorized();
  }

  if (!expression) {
    throw ApiError("Expression missing");
  }

  const createdExpression: ExpressionEntity = await createExpression(
    user.id,
    expression,
  );

  return res.status(200).send(createdExpression);
};

export default TryCatch(addExpression);
