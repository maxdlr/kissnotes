import { NativeExpressionModel } from "@kissnotes/types";
import { Request, Response } from "express";
import updateNativeExpression from "../services/updateNativeExpression";

const editNativeExpression = async (
  req: Request,
  res: Response,
): Promise<Response<NativeExpressionModel>> => {
  const { nativeExpression } = req.body;

  if (!nativeExpression?.id) {
    throw ApiError("Id missing");
  }

  const updatedNativeExpression =
    await updateNativeExpression(nativeExpression);
  return res.status(200).send(updatedNativeExpression);
};

export default editNativeExpression;
