"use client";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import useAuth from "@/hooks/AuthProvider";
import axios from "@/services/axios";
import { getUsername } from "@/utils/getProfileHref";
import { UserProvider } from "./hooks/UserContext";

interface ProfilePageLayoutProps {
  children?: React.ReactNode;
  currentHandle?: string;
}

const ProfilePageLayoutContent = ({
  children,
  currentHandle,
}: ProfilePageLayoutProps) => {
  const router = useRouter();
  const { isAuthUser } = useAuth();
  const logOut = () => {
    axios.post("/logout");
    if (isAuthUser({ username: getUsername(currentHandle) })) {
      window.location.href = "/";
    }
  };

  return (
    <>
      <div className="flex justify-between items-center">
        <Button
          label="Back"
          onClick={router.back}
          Icon={ArrowLeftIcon}
          shortcut={{ keys: ["ESC"] }}
          variant="ghost"
          className="block"
        />
        <Button
          label="Logout"
          onClick={logOut}
          danger
          shortcut={{ keys: ["cmd", "shift", "ESC"] }}
          variant="outline-accent"
          size="sm"
        />
      </div>
      {children}
    </>
  );
};

const ProfilePageLayout = ({ children }: ProfilePageLayoutProps) => {
  const { handle } = useParams();
  return (
    <UserProvider handle={handle}>
      <ProfilePageLayoutContent currentHandle={handle as string}>
        {children}
      </ProfilePageLayoutContent>
    </UserProvider>
  );
};
export default ProfilePageLayout;
