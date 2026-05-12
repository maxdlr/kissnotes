import { TryCatch } from "@/decorators/TryCatch";
import { Request, Response } from "express";
import setAuthCookies from "../services/setAuthCookie";
import createUser from "@/api/users/services/createUser";

const signUp = async ({ body }: Request, res: Response) => {
  const { email, username, password, description } = body;

  const user = await createUser({
    email,
    username,
    password,
    description,
  });

  const cookiePayload: any = {
    id: user.id,
    email,
    username,
  };

  await setAuthCookies(res, cookiePayload);

  return res.status(202).send();
};
export default TryCatch(signUp);
