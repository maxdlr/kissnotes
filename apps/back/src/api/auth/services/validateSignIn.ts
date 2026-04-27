import { AuthId } from "@kissnotes/types";

const validateSignIn = ({
  username,
  password,
}: AuthId): { error?: string[] } => {
  console.log("sign in", { username, password });
  return {} as { error: string[] };
};
export default validateSignIn;
