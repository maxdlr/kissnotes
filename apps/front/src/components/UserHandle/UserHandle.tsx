import useAuth from "@/hooks/AuthProvider";
import { getProfileHref } from "@/utils/getProfileHref";
import { Button } from "../Button";

interface UserHandleProps {
  username?: string;
  className?: string;
}
const UserHandle = ({ username, className }: UserHandleProps) => {

  const { user } = useAuth();
  const shownUsername = username || user?.username;

  if (!shownUsername) {
    return null;
  }

  const handle = `@${shownUsername}`;
  return (
    <Button
      href={getProfileHref(shownUsername)}
      label={handle}
      variant="ghost"
      className={className}
    />
  );
};

export default UserHandle;
