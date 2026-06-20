import { TryCatch } from "@/decorators/TryCatch";
import ExpressionEntity from "@/entities/ExpressionEntity";
import { ExpressionModel } from "@kissnotes/types";
import { Request, Response } from "express";
import createExpression from "../services/createExpression";

const addExpression = async (
  { user, body }: Request,
  res: Response,
): Promise<Response<ExpressionModel>> => {
  if (!user) {
    throw Unauthorized();
  }

  if (!body) {
    throw ApiError("Expression missing");
  }

  const createdExpression: ExpressionEntity = await createExpression(
    user.id,
    body,
  );

  return res.status(200).send(createdExpression);
};

export default TryCatch(addExpression);
