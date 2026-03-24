"use client";
import useAuth from "@/hooks/AuthProvider";
import { Button } from "../Button";
import { Logo } from "../Logo";
import { SearchBar } from "../SearchBar";
import { UserHandle } from "../UserHandle";

const Header = () => {
  const { user, logIn } = useAuth();

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
          <UserHandle />
        ) : (
          <Button
            label="Sign in"
            shortcut={{ keys: ["cmd", "shift", "L"] }}
            onClick={handleSignIn}
          />
        )}
      </div>
    </header>
  );
};
export default Header;
