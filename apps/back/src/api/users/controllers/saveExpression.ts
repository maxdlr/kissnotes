import findExpression from "@/api/expressions/services/findExpression";
import findNativeExpression from "@/api/native-expressions/services/findNativeExpression";
import { Request, Response } from "express";
import createSave from "../services/createSave";

const saveExpression = async ({ user, body }: Request, res: Response) => {
  if (!user) {
    throw Unauthorized();
  }

  const { expressionId, nativeExpressionId } = body;

  if (!expressionId && !nativeExpressionId) {
    throw ApiError("Missing expressionId or nativeExpressionId");
  }

  if (expressionId) {
    const expression = await findExpression(expressionId);
    if (!expression) {
      throw Missing("Expression not found");
    }
  } else {
    const nativeExpression = await findNativeExpression(nativeExpressionId);
    if (!nativeExpression) {
      throw Missing("Native expression not found");
    }
  }

  await createSave({
    expressionId,
    nativeExpressionId,
    userId: user.id,
  }).catch((e) => {
    throw ApiError("Failed to save expression: " + e.message);
  });

  return res.status(201).end();
};

export default saveExpression;
