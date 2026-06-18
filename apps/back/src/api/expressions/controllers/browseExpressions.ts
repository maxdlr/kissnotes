import { TryCatch } from "@/decorators/TryCatch";
import ExpressionEntity from "@/entities/ExpressionEntity";
import { Request, Response } from "express";
import findAllExpressions from "../services/findAllExpressions";

const browseExpressions = async (
  req: Request,
  res: Response,
): Promise<Response<ExpressionEntity[]>> => {
  const expressions = await findAllExpressions(req.query);

  return res.status(200).send(expressions);
};

export default TryCatch(browseExpressions);
