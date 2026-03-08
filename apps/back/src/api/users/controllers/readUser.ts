import { UserModel } from "@kissnotes/types";
import { Request, Response } from "express";
import findUser from "../../users/services/findUser";
import { TryCatch } from "@/decorators/TryCatch";

const readUser = async (
  req: Request,
  res: Response,
): Promise<Response<UserModel>> => {
  const { id, username } = req.query;
  const user = await findUser({ id: Number(id), username: username as string });

  return res.status(200).send(user);
};
export default TryCatch(readUser);
