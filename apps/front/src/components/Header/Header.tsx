"use client";
import {
  Cog6ToothIcon as Cog6ToothOutlineIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import {
  Cog6ToothIcon as Cog6ToothFillIcon,
  ServerStackIcon,
} from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import SearchBar from "@/components/SearchBar";
import UserHandle from "@/components/UserHandle";
import useAuth from "@/contexts/AuthContext/useAuth";
import { getProfileHref } from "@/utils/userUtils";
import Logo from "../Logo";
import useBreakpoints from "@/hooks/useBreakpoints";

const getLoginHref = () => {
  const referrer = window.location.pathname;
  return referrer && referrer !== "/"
    ? `/login?referrer=${referrer}`
    : "/login";
};

const Header = ({ className }: { className?: string }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { sm } = useBreakpoints();

  return (
    <header
      className={`flex justify-evenly items-center w-full gap-6 bg-darker ${className}`}
    >
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
      {user?.type === "admin" && (
        <Button
          Icon={ServerStackIcon}
          label={sm ? undefined : "Admin"}
          href="/admin"
          variant="ghost"
        />
      )}
      {loading ? (
        <div className="w-24">
          <Loading count={8} minSize={1} maxSize={20} />
        </div>
      ) : user ? (
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
