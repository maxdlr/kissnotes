"use client";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import useAuth from "@/hooks/AuthProvider";
import { getUsername } from "@/utils/getProfileHref";

const UserProfileHeader = () => {
  const { isAuthUser } = useAuth();
  const { handle } = useParams();
  const router = useRouter();
  const logOut = () => {
    axios.post("/logout");
    if (isAuthUser({ username: getUsername(handle) })) {
      window.location.href = "/";
    }
  };

  return (
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
  );
};

export default UserProfileHeader;
