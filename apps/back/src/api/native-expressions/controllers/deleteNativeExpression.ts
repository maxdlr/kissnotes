import { TryCatch } from "@/decorators/TryCatch";
import { Request, Response } from "express";
import removeNativeExpression from "../services/removeNativeExpression";

const deleteNativeExpression = async (
  req: Request,
  res: Response,
): Promise<Response<string>> => {
  await removeNativeExpression(req.query);
  return res.status(200).send("NativeExpression deleted");
};

export default TryCatch(deleteNativeExpression);
