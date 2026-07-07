"use client";
import Button from "@/components/Button";
import { ButtonProps } from "@/components/Button/interfaces";
import { ChartBarIcon } from "@heroicons/react/16/solid";
import {
  CodeBracketIcon,
  CommandLineIcon,
  UserIcon,
} from "@heroicons/react/24/solid";
import { useParams } from "next/navigation";

const SidebarDefault = () => {
  const { entity } = useParams();

  const menu: Partial<ButtonProps & { selected: boolean }>[] = [
    {
      label: "Dashboard",
      href: "/admin",
      Icon: ChartBarIcon,
      selected: !entity,
    },
    {
      label: "Users",
      href: "/admin/users",
      Icon: UserIcon,
      selected: entity === "users",
    },
    {
      label: "Expressions",
      href: "/admin/expressions",
      Icon: CodeBracketIcon,
      selected: entity === "expressions",
    },
    {
      label: "Native Expressions",
      href: "/admin/native-expressions",
      Icon: CommandLineIcon,
      selected: entity === "native-expressions",
    },
  ];

  return (
    <>
      <div className="hidden md:flex flex-col gap-4">
        {menu.map((item, index) => (
          <Button
            key={index}
            {...item}
            variant={item.selected ? "ghost-secondary" : "ghost"}
          />
        ))}
      </div>
      <div className="flex justify-center items-center md:hidden gap-4">
        {menu.map((item, index) => (
          <Button
            key={index}
            {...item}
            variant={item.selected ? "ghost-secondary" : "ghost"}
            label={undefined}
          />
        ))}
      </div>
    </>
  );
};
export default SidebarDefault;
