"use client";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { Button } from "@/components/Button";
import type { ButtonProps } from "@/components/Button/Button";

interface ProfilePageLayoutProps {
  children?: React.ReactNode;
}

const ProfilePageLayout = ({ children }: ProfilePageLayoutProps) => {
  const router = useRouter();

  const menu: (ButtonProps & { enabled?: boolean })[] = [
    {
      enabled: true,
      label: "Back",
      onClick: router.back,
      Icon: ArrowLeftIcon,
      shortcut: { keys: ["ESC"] },
      variant: "ghost",
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
