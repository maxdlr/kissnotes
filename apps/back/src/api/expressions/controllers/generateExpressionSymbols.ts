import findAllNativeExpressions from "@/api/native-expressions/services/findAllNativeExpressions";
import { CodeModel } from "@kissnotes/types";
import { Request, Response } from "express";
import { parseAeExpression } from "../services/parseAeExpressions";

const generateExpressionSymbols = async ({ body }: Request, res: Response) => {
  if (!body) {
    throw ApiError("Code block is required");
  }

  const nativeExpressions = await findAllNativeExpressions();
  const expressionSymbols = parseAeExpression(
    body as CodeModel,
    nativeExpressions,
  );
  return res.status(200).send(expressionSymbols);
};
export default generateExpressionSymbols;
