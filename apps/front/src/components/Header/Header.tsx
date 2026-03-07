import type { UserModel } from "@kissnotes/types";
import useAxios from "@/hooks/useAxios";
import { Button } from "../Button";
import { Logo } from "../Logo";
import { SearchBar } from "../SearchBar";
import { UserHandle } from "../UserHandle";

interface HeaderProps {
  user?: UserModel;
}
const Header = ({ user }: HeaderProps) => {
  const { postData } = useAxios("/login");

  const handleSignIn = async () => {
    await postData({
      username: "maxdlr",
      password: "password",
    });
  };
  return (
    <header className="p-8 grid grid-cols-5 items-center">
      <div className="w-fit text-end">
        <Logo />
        <p className="text-sm leading-none italic">by Motiontober</p>
      </div>
      <SearchBar className="col-span-3" shortcut={["cmd", "K"]} />
      <div className="text-end w-full">
        {user ? (
          <UserHandle user={user} />
        ) : (
          <Button
            label="Sign in"
            shortcut={["cmd", "L"]}
            onClick={handleSignIn}
          />
        )}
      </div>
    </header>
  );
};
export default Header;
