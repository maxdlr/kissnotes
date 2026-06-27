import Button from "@/components/Button";
import useAuth from "@/contexts/AuthContext/useAuth";
import { getProfileHref } from "@/utils/userUtils";

interface UserHandleProps {
  username?: string;
  className?: string;
}
const UserHandle = ({ username, className }: UserHandleProps) => {
  const { user } = useAuth();
  const localUsername = username || user?.username;

  if (!localUsername) {
    return null;
  }

  return (
    <Button
      href={getProfileHref(localUsername)}
      label={`@${localUsername}`}
      variant="ghost"
      className={className}
    />
  );
};

export default UserHandle;
