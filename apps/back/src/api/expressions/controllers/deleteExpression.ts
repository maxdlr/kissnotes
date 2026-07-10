import { Request, Response } from "express";
import removeExpression from "../services/removeExpression";

const deleteExpression = async (
  req: Request,
  res: Response,
): Promise<Response<string>> => {
  await removeExpression(req.query);
  return res.status(200).send("Expression deleted");
};

export default deleteExpression;
