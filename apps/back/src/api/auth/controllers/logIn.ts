import { Request, Response } from "express";
import setAuthCookies from "../services/setAuthCookie";
import findUser from "@/api/users/services/findUser";
import { TryCatch } from "@/decorators/TryCatch";

const logIn = async ({ body }: Request, res: Response) => {
  let user = await findUser({ username: body.username });

  if (!user) {
    throw ApiError("Email ou mot de passe incorrect");
  }

  if (!(await user.comparePassword(body.password))) {
    throw ApiError("Email ou mot de passe incorrect");
  }

  const { id, email, username } = user;

  // Define cookie payload
  const cookiePayload: any = {
    id,
    email,
    username,
  };

  await setAuthCookies(res, cookiePayload);
  // type is returned to help the front-end redirect the user to the right flow
  return res.status(202).end();
};
export default TryCatch(logIn);
