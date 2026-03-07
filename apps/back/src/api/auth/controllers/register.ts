import { TryCatch } from "@/decorators/TryCatch";
import { Request, Response } from "express";

const register = ({ body }: Request, res: Response) => {
  if (!body || !body.email || !body.username || !body.password) {
    throw ApiError("something missing");
  }
  return res.status(200).send();
};
export default TryCatch(register);
