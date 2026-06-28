"use client";
import Button from "@/components/Button";
import { ButtonProps } from "@/components/Button/interfaces";
import {
  CodeBracketIcon,
  CommandLineIcon,
  UserIcon,
} from "@heroicons/react/24/solid";

const SidebarDefault = () => {
  const menu: Partial<ButtonProps>[] = [
    {
      label: "Users",
      href: "/admin/users",
      Icon: UserIcon,
    },
    {
      label: "Expressions",
      href: "/admin/expressions",
      Icon: CodeBracketIcon,
    },
    {
      label: "Native Expressions",
      href: "/admin/native-expressions",
      Icon: CommandLineIcon,
    },
  ];

  return (
    <>
      <div className="hidden md:flex flex-col gap-4">
        {menu.map((item, index) => (
          <Button key={index} {...item} variant="ghost-secondary" />
        ))}
      </div>
      <div className="flex justify-center items-center md:hidden gap-4">
        {menu.map((item, index) => (
          <Button
            key={index}
            {...item}
            variant="ghost-secondary"
            label={undefined}
          />
        ))}
      </div>
    </>
  );
};
export default SidebarDefault;
