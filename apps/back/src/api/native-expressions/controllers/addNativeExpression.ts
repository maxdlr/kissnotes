import { TryCatch } from "@/decorators/TryCatch";
import { NativeExpressionModel } from "@kissnotes/types";
import { NextFunction, Request, Response } from "express";
import createNativeExpression from "../services/createNativeExpression";
import NativeExpressionEntity from "@/entities/NativeExpressionEntity";

const addNativeExpression = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response<NativeExpressionModel>> => {
  const nativeExpression = req.body.expression;

  if (!nativeExpression) {
    throw ApiError("NativeExpression missing");
  }

  const createdNativeExpression: NativeExpressionEntity =
    await createNativeExpression(nativeExpression);

  return res.status(200).send(createdNativeExpression);
};

export default TryCatch(addNativeExpression);
