import { NextFunction, Request, Response } from "express";
import findAllUsers from "../../users/services/findAllUsers";
import UserEntity from "@/entities/UserEntity";
import { TryCatch } from "@/decorators/TryCatch";

const browseUsers = async (
  req: Request,
  res: Response,
  _next: NextFunction,
): Promise<Response<UserEntity[]>> => {
  const users = await findAllUsers(req.query);

  return res.status(200).send(users);
};

export default TryCatch(browseUsers);
