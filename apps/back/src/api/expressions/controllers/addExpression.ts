import { TryCatch } from "@/decorators/TryCatch";
import ExpressionEntity from "@/entities/ExpressionEntity";
import { ExpressionModel } from "@kissnotes/types";
import { Request, Response } from "express";
import createExpression from "../services/createExpression";

const addExpression = async (
  { user, body }: Request,
  res: Response,
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
