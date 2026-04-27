import useAuth from "@/contexts/AuthContext/useAuth";
import { getProfileHref } from "@/utils/getProfileHref";
import Button from "../Button";
import { useRouter } from "next/navigation";

interface UserHandleProps {
  username?: string;
  className?: string;
}
const UserHandle = ({ username, className }: UserHandleProps) => {
  const { user } = useAuth();
  const shownUsername = username || user?.username;
  const router = useRouter();

  if (!shownUsername) {
    return null;
  }

  const handle = `@${shownUsername}`;
  return (
    <Button
      onClick={() => router.push(getProfileHref(shownUsername))}
      label={handle}
      variant="ghost"
      className={className}
    />
  );
};

export default UserHandle;
