"use client";
import {
  ArrowLeftIcon,
  UserIcon,
  UserMinusIcon,
} from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
import { Button } from "@/components/Button";
import type { ButtonProps } from "@/components/Button/Button";
import useAxios from "@/hooks/useAxios";
import { getProfileHref, getUsername } from "@/utils/getProfileHref";

interface ProfilePageProps {
  className?: string;
}

const ProfilePage = ({ className }: ProfilePageProps) => {
  const { handle } = useParams();

  const { postData } = useAxios("/logout");

  const handleLogOut = async () => {
    await postData({});
  };

  const menu: ButtonProps[] = [
    {
      label: "Back",
      Icon: ArrowLeftIcon,
      shortcut: { keys: ["ESC"] },
      variant: "ghost",
    },
    {
      label: `Settings`,
      Icon: UserIcon,
      href: `${getProfileHref(getUsername(handle))}/settings`,
    },
    {
      label: "Log out",
      Icon: UserMinusIcon,
      onClick: handleLogOut,
    },
  ];

  const asideCls = "grid grid-flow-row gap-2 sm:gap-4";

  return (
    <>
      <aside className={`block sm:hidden ${asideCls}`}>
        {menu.map((b) => (
          <Button
            {...b}
            key={b.label as string}
            className={`${b.className}`}
            variant="ghost"
            Icon={b.label === menu[0].label ? b.Icon : undefined}
            label={b.label !== menu[0].label ? b.label : undefined}
          />
        ))}
      </aside>
      <aside className={`hidden sm:block ${asideCls}`}>
        {menu.map((b) => (
          <Button {...b} key={b.label as string} className={`${b.className}`} />
        ))}
      </aside>
    </>
  );
};
export default ProfilePage;
