"use client";
import {
  Cog6ToothIcon as Cog6ToothOutlineIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { Cog6ToothIcon as Cog6ToothFillIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/AuthProvider";
import { getProfileHref } from "@/utils/getProfileHref";
import { Button } from "../Button";
import { Logo } from "../Logo";
import { SearchBar } from "../SearchBar";
import { UserHandle } from "../UserHandle";

const getLoginHref = () => {
  const referrer = window.location.pathname;
  return referrer && referrer !== "/" ? `/login?referrer=${referrer}` : "/login";
};

const Header = () => {
  const { user } = useAuth();
  const router = useRouter();

  return (
    <header className="flex justify-evenly items-center w-full gap-6 bg-darker">
      <Logo className="hidden md:block" />
      <Button
        Icon={HomeIcon}
        variant="ghost"
        href="/"
        className="block md:hidden"
      />
      <SearchBar
        shortcut={{ keys: ["cmd", "K"] }}
        modalSearcher
        className="w-full"
      />
      {user ? (
        <div className="flex justify-center items-center gap-2">
          <Button
            Icon={Cog6ToothOutlineIcon}
            HoverIcon={Cog6ToothFillIcon}
            variant="ghost"
            size="sm"
            href={`${getProfileHref(user.username)}/settings`}
          />
          <UserHandle className="hover:text-primary!" />
        </div>
      ) : (
        <Button
          label="Log in"
          shortcut={{ keys: ["cmd", "shift", "L"] }}
          onClick={() => router.push(getLoginHref())}
          variant="outline"
        />
      )}
    </header>
  );
};
export default Header;
