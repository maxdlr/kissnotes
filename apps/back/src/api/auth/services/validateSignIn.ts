import { AuthId } from "@kissnotes/types";

const validateSignIn = ({
  username,
  password,
}: AuthId): { error?: string[] } => {
  console.log("sign in", { username, password });
  const error = {} as { error: string[] };
  return {};
};
export default validateSignIn;
