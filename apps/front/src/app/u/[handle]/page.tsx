"use client";
import { UserIcon } from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
import { Button } from "@/components/Button";
import { Header } from "@/components/Header";
import { getHandle, getProfileHref, getUsername } from "@/utils/getProfileHref";

interface ProfilePageProps {
  className?: string;
}

const ProfilePage = ({ className }: ProfilePageProps) => {
  const { handle } = useParams();

  return (
    <>
      <Header />
      <Button
        label={`${getHandle(handle) as string} settings`}
        Icon={UserIcon}
        href={`${getProfileHref(getUsername(handle))}/settings`}
      />
    </>
  );
};
export default ProfilePage;
