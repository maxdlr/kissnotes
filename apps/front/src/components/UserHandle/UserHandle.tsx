import type { UserModel } from "@kissnotes/types";
import { Button } from "../Button";

interface UserHandleProps {
  user: UserModel;
}
const UserHandle = ({ user }: UserHandleProps) => {
  const { username } = user;
  return <Button label={`@${username}`} variant="ghost" />;
};

export default UserHandle;
