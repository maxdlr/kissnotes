"use client";
import useAuth from "@/contexts/AuthContext/useAuth";
import { getProfileHref } from "@/utils/userUtils";
import {
  Cog6ToothIcon as OCog6ToothIcon,
  HomeIcon as OHomeIcon,
  MagnifyingGlassIcon as OMagnifyingGlassIcon,
  PlusIcon as OPlusIcon,
  ServerStackIcon as OServerStackIcon,
  UserIcon as OUserIcon,
} from "@heroicons/react/24/outline";
import {
  Cog6ToothIcon as SCog6ToothIcon,
  HomeIcon as SHomeIcon,
  MagnifyingGlassIcon as SMagnifyingGlassIcon,
  PlusIcon as SPlusIcon,
  ServerStackIcon as SServerStackIcon,
  UserIcon as SUserIcon,
} from "@heroicons/react/24/solid";
import { motion } from "motion/react";
import { usePathname } from "next/navigation";
import { ElementType } from "react";
import Button from "../Button";
import useSearcher from "../Searcher/hooks/SearcherProvider";

const MobileMenu = ({ className }: { className?: string }) => {
  const auth = useAuth();
  const pathname = usePathname();
  const { setIsOpen } = useSearcher();

  const menuItems: {
    slug: string;
    href?: string;
    InactiveIcon: ElementType;
    ActiveIcon: ElementType;
  }[] = [
    {
      slug: "home",
      href: "/",
      InactiveIcon: OHomeIcon,
      ActiveIcon: SHomeIcon,
    },
    {
      slug: "search",
      InactiveIcon: OMagnifyingGlassIcon,
      ActiveIcon: SMagnifyingGlassIcon,
    },
  ];

  if (!auth?.user) {
    menuItems.push({
      slug: "login",
      href: "/login",
      InactiveIcon: OUserIcon,
      ActiveIcon: SUserIcon,
    });
  }

  if (auth?.user) {
    menuItems.push(
      {
        slug: "add",
        href: "/form/new",
        InactiveIcon: OPlusIcon,
        ActiveIcon: SPlusIcon,
      },
      {
        slug: "account",
        href: getProfileHref(auth.user.username),
        InactiveIcon: OUserIcon,
        ActiveIcon: SUserIcon,
      },
      {
        slug: "settings",
        href: `${getProfileHref(auth.user.username)}/settings`,
        InactiveIcon: OCog6ToothIcon,
        ActiveIcon: SCog6ToothIcon,
      },
    );
  }

  if (auth?.user?.type === "admin") {
    menuItems.push({
      slug: "admin",
      href: "/admin",
      InactiveIcon: OServerStackIcon,
      ActiveIcon: SServerStackIcon,
    });
  }

  const menu = menuItems;

  return (
    <div className={`fixed left-0 bottom-0 z-999999 w-full ${className}`}>
      <motion.div
        className="bg-dark py-3 border-t rounded-t-4xl"
        initial={{ opacity: 0, y: "100%" }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          type: "spring",
          bounce: 0.5,
        }}
      >
        <div className="flex justify-evenly items-center">
          {menu.map(({ slug, href, InactiveIcon, ActiveIcon }) => (
            <div key={slug}>
              <Button
                href={href}
                Icon={pathname === href ? ActiveIcon : InactiveIcon}
                HoverIcon={ActiveIcon}
                size="lg"
                variant="ghost"
                className={`${pathname === href ? "text-secondary!" : "text-accent"} py-4!`}
                iconSize="size-8"
                onClick={slug === "search" ? () => setIsOpen(true) : undefined}
              />
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
export default MobileMenu;
