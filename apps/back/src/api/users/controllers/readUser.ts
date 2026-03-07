import { UserModel } from "@kissnotes/types";
import { Request, Response } from "express";
import findUser from "../../users/services/findUser";
import { TryCatch } from "@/decorators/TryCatch";

const readUser = async (
  req: Request,
  res: Response,
): Promise<Response<UserModel>> => {
  const { id } = req.query;
  if (!id) {
    throw ApiError("User arguments missing");
  }
  const user = await findUser({ id: Number(id) });

  return res.status(200).send(user);
};
export default TryCatch(readUser);
