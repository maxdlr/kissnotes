"use client";
import { ArrowLeftIcon, UserIcon } from "@heroicons/react/24/outline";
import { useParams } from "next/navigation";
import { Button } from "@/components/Button";
import type { ButtonProps } from "@/components/Button/Button";
import useAuth from "@/hooks/AuthProvider";
import { getProfileHref, getUsername } from "@/utils/getProfileHref";

interface ProfilePageLayoutProps {
  children?: React.ReactNode;
}

const ProfilePageLayout = ({ children }: ProfilePageLayoutProps) => {
  const { handle } = useParams();
  const { isAuthUser } = useAuth();

  const menu: (ButtonProps & { enabled?: boolean })[] = [
    {
      enabled: true,
      label: "Back",
      Icon: ArrowLeftIcon,
      shortcut: { keys: ["ESC"] },
      variant: "ghost",
    },
    {
      enabled: isAuthUser({ username: getUsername(handle) as string }),
      label: `Settings`,
      Icon: UserIcon,
      href: `${getProfileHref(getUsername(handle))}/settings`,
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
        {menu
          .filter((b) => b.enabled)
          .map((b) => (
            <Button
              {...b}
              key={b.label as string}
              className={`${b.className}`}
            />
          ))}
      </aside>
      {children}
    </>
  );
};
export default ProfilePageLayout;
