"use client";
import { Cog6ToothIcon as Cog6ToothOutlineIcon } from "@heroicons/react/24/outline";
import { Cog6ToothIcon as Cog6ToothFillIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import useAuth from "@/hooks/AuthProvider";
import { getProfileHref } from "@/utils/getProfileHref";
import { Button } from "../Button";
import { Logo } from "../Logo";
import { SearchBar } from "../SearchBar";
import { UserHandle } from "../UserHandle";

const Header = () => {
  const { user, logIn } = useAuth();
  const router = useRouter();

  const handleSignIn = () => {
    logIn({
      username: "maxdlr",
      password: "password",
    });
  };
  return (
    <header className="grid grid-cols-3 md:grid-cols-5 items-center bg-darker">
      <Logo className="hidden md:block" />
      <SearchBar
        className="col-span-2 md:col-span-3"
        shortcut={{ keys: ["cmd", "K"] }}
        modalSearcher
      />
      <div className="place-self-end self-center">
        {user ? (
          <div className="flex justify-center items-center gap-2">
            <Button
              Icon={Cog6ToothOutlineIcon}
              HoverIcon={Cog6ToothFillIcon}
              variant="ghost"
              size="sm"
              className="px-0!"
              onClick={() =>
                router.push(`${getProfileHref(user.username)}/settings`)
              }
            />
            <UserHandle className="hover:text-primary!" />
          </div>
        ) : (
          <Button
            label="Log in"
            shortcut={{ keys: ["cmd", "shift", "L"] }}
            onClick={handleSignIn}
            variant="outline"
          />
        )}
      </div>
    </header>
  );
};
export default Header;
