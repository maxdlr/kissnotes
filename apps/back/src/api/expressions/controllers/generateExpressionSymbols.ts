import findAllNativeExpressions from "@/api/native-expressions/services/findAllNativeExpressions";
import { CodeModel } from "@kissnotes/types";
import { Request, Response } from "express";
import { parseAeExpression } from "../services/parseAeExpressions";

const generateExpressionSymbols = async (req: Request, res: Response) => {
  const { code } = req.body;

  console.log({ code });

  if (!code) {
    throw ApiError("Code block is required");
  }

  const nativeExpressions = await findAllNativeExpressions();
  const expressionSymbols = parseAeExpression(
    code as CodeModel,
    nativeExpressions,
  );
  return res.status(200).send(expressionSymbols);
};
export default generateExpressionSymbols;
