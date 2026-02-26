import { NextFunction, Request, Response } from "express";
import findAllExpressions from "../services/findAllExpressions";
import ExpressionEntity from "@/entities/Expression";

const getAllExpressions = async (
  _req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response<ExpressionEntity[]>> => {
  const expressions = await findAllExpressions();

  return res.status(200).send(expressions);
};

export default getAllExpressions;
