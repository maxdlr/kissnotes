import { ExpressionModel } from "@kissnotes/types";
import { Request, Response } from "express";
import findExpression from "../services/findExpression";
import { TryCatch } from "@/decorators/TryCatch";

const readExpression = async (
  req: Request,
  res: Response,
): Promise<Response<ExpressionModel>> => {
  const { id } = req.query;
  if (!id) {
    throw ApiError("Expression arguments missing");
  }
  const expression = await findExpression(Number(id));

  return res.status(200).send(expression);
};
export default TryCatch(readExpression);
