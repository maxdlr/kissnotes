import { TryCatch } from "@/decorators/TryCatch";
import { filteredParams } from "@/utils/filteredParams";
import { UserModel } from "@kissnotes/types";
import { Request, Response } from "express";
import findUser from "../../users/services/findUser";

const readUser = async (
  req: Request,
  res: Response,
): Promise<Response<UserModel>> => {
  const { id, username, email } = req.query;

  if (!id && !username && !email) {
    throw ApiError(400, "Id or username/email required to find user");
  }

  const params = filteredParams({
    id,
    username: username as string,
    email: email as string,
  });

  const user = await findUser(
    params as Pick<UserModel, "id" | "username" | "email">,
  );

  return res.status(200).send(user);
};
export default TryCatch(readUser);
