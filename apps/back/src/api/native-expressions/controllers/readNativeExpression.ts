import { NativeExpressionModel } from "@kissnotes/types";
import { Request, Response } from "express";
import findNativeExpression from "../services/findNativeExpression";
import { TryCatch } from "@/decorators/TryCatch";

const readNativeExpression = async (
  req: Request,
  res: Response,
): Promise<Response<NativeExpressionModel>> => {
  const { id } = req.query;
  if (!id) {
    throw ApiError("Id missing");
  }
  const expression = await findNativeExpression(Number(id));

  return res.status(200).send(expression);
};
export default TryCatch(readNativeExpression);
