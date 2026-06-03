import Button from "@/components/Button";
import useAuth from "@/contexts/AuthContext/useAuth";
import { getProfileHref } from "@/utils/userUtils";
import { useRouter } from "next/navigation";

interface UserHandleProps {
  username?: string;
  className?: string;
}
const UserHandle = ({ username, className }: UserHandleProps) => {
  const { user } = useAuth();
  const localUsername = username || user?.username;
  const router = useRouter();

  if (!localUsername) {
    return null;
  }

  return (
    <Button
      onClick={() => router.push(getProfileHref(localUsername))}
      label={`@${localUsername}`}
      variant="ghost"
      className={className}
    />
  );
};

export default UserHandle;
