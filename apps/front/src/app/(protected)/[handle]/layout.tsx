"use client";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import { UserProvider } from "./hooks/UserContext";

interface ProfilePageLayoutProps {
  children?: React.ReactNode;
}

const ProfilePageLayout = ({ children }: ProfilePageLayoutProps) => {
  const router = useRouter();
  const { handle } = useParams();

  return (
    <>
      <Button
        label="Back"
        onClick={router.back}
        Icon={ArrowLeftIcon}
        shortcut={{ keys: ["ESC"] }}
        variant="ghost"
        className="block"
      />
      <UserProvider handle={handle}>{children}</UserProvider>
    </>
  );
};
export default ProfilePageLayout;
