import { UserModel } from "@kissnotes/types";
import { Request, Response } from "express";
import updateUser from "../../users/services/updateUser";

const editUser = async (
  req: Request,
  res: Response,
): Promise<Response<UserModel>> => {
  const { user } = req.body;

  if (!user) {
    throw ApiError("User missing");
  }

  const updatedUser = await updateUser(user);
  return res.status(200).send(updatedUser);
};

export default editUser;
