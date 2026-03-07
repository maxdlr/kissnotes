import findUser from "@/api/users/services/findUser";
import { AuthId } from "@kissnotes/types";
import validateSignIn from "./validateSignIn";

const verifyCredentials = async (data: AuthId) => {
  data.username = data.username.trim().toLowerCase();

  const { error } = validateSignIn(data);

  if (error) {
    throw error;
  }

  const { username, password } = data;

  const user = await findUser({ username });

  if (!user || !user.password) {
    throw ApiError("Email ou mot de passe incorrect");
  }

  const pwdMatch = await user.comparePassword(password);

  if (!pwdMatch) {
    throw ApiError("Email ou mot de passe incorrect");
  }

  return user;
};

export default verifyCredentials;
