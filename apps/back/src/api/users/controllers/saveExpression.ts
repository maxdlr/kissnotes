import findExpression from "@/api/expressions/services/findExpression";
import { Request, Response } from "express";
import createSave from "../services/createSave";

const saveExpression = async ({ user, body }: Request, res: Response) => {
  if (!user) {
    throw Unauthorized();
  }

  if (!body.expressionId) {
    throw ApiError("Missing expressionId");
  }

  const { expressionId } = body;

  const expression = findExpression(expressionId);

  if (!expression) {
    throw Missing("Expression not found");
  }

  if (user.saves?.includes(expressionId)) {
    throw ApiError("Expression already saved");
  }

  await createSave(expressionId, user.id).catch((e) => {
    throw ApiError("Failed to save expression: " + e.message);
  });

  return res.status(201).end();
};
export default saveExpression;
