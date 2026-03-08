import findUser from "@/api/users/services/findUser";
import UserEntity from "@/entities/UserEntity";
import { Request, Response } from "express";

const getMe = async (
  { user }: Request,
  res: Response,
): Promise<Response<UserEntity>> => {
  if (!user) {
    throw Unauthorized("user");
  }
  const me = await findUser({ id: user.id });
  return res.status(200).send(me);
};
export default getMe;
