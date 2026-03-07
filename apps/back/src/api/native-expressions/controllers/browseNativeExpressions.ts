import { NextFunction, Request, Response } from "express";
import findAllNativeExpressions from "../services/findAllNativeExpressions";
import NativeExpressionEntity from "@/entities/NativeExpressionEntity";
import { TryCatch } from "@/decorators/TryCatch";

const browseNativeExpressions = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response<NativeExpressionEntity[]>> => {
  const nativeExpressions = await findAllNativeExpressions(req.query);

  return res.status(200).send(nativeExpressions);
};

export default TryCatch(browseNativeExpressions);
