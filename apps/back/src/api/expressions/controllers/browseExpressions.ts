import { NextFunction, Request, Response } from "express";
import findAllExpressions from "../services/findAllExpressions";
import ExpressionEntity from "@/entities/ExpressionEntity";
import { TryCatch } from "@/decorators/TryCatch";

const browseExpressions = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response<ExpressionEntity[]>> => {
  const expressions = await findAllExpressions(req.query);

  return res.status(200).send(expressions);
};

export default TryCatch(browseExpressions);
