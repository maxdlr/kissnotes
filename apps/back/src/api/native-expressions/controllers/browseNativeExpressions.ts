import { Request, Response } from "express";
import findAllNativeExpressions from "../services/findAllNativeExpressions";
import NativeExpressionEntity from "@/entities/NativeExpressionEntity";

const browseNativeExpressions = async (
  req: Request,
  res: Response,
): Promise<Response<NativeExpressionEntity[]>> => {
  const nativeExpressions = await findAllNativeExpressions(req.query);

  return res.status(200).send(nativeExpressions);
};

export default browseNativeExpressions;
