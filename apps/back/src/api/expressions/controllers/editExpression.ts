import { ExpressionModel } from "@kissnotes/types";
import { Request, Response } from "express";
import updateExpression from "../services/updateExpression";

const editExpression = async (
  req: Request,
  res: Response,
): Promise<Response<ExpressionModel>> => {
  const { expression } = req.body;

  if (!expression?.id) {
    throw ApiError("Id missing");
  }

  const updatedExpression = await updateExpression(expression);
  return res.status(200).send(updatedExpression);
};

export default editExpression;
