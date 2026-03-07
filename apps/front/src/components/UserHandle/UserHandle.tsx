import type { UserModel } from "@kissnotes/types";
import { Button } from "../Button";

interface UserHandleProps {
  user: UserModel;
  className?: string;
}
const UserHandle = ({ user, className }: UserHandleProps) => {
  const { username } = user;
  return (
    <div className={className}>
      <Button label={`@${username}`} variant="ghost" />
    </div>
  );
};

export default UserHandle;
