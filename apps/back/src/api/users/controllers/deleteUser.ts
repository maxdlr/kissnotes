import { TryCatch } from "@/decorators/TryCatch";
import { Request, Response } from "express";
import removeUser from "../../users/services/removeUser";

const deleteUser = async (
  req: Request,
  res: Response,
): Promise<Response<string>> => {
  await removeUser(req.query);
  return res.status(200).send("User deleted");
};

export default TryCatch(deleteUser);
