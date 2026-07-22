"use client";
import {
  CodeBracketIcon,
  Cog6ToothIcon as Cog6ToothOutlineIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import {
  Cog6ToothIcon as Cog6ToothFillIcon,
  ServerStackIcon,
} from "@heroicons/react/24/solid";
import { usePathname, useRouter } from "next/navigation";
import Button from "@/components/Button";
import Loading from "@/components/Loading";
import SearchBar from "@/components/SearchBar";
import UserHandle from "@/components/UserHandle";
import useAuth from "@/contexts/AuthContext/useAuth";
import { getProfileHref } from "@/utils/userUtils";
import Logo from "../Logo";
import useBreakpoints from "@/hooks/useBreakpoints";
import { UserIcon } from "@heroicons/react/16/solid";
import { Fragment } from "react/jsx-runtime";
import Tooltip from "../Tooltip";
import useBrowse from "@/hooks/bread/useBrowse";
import { DashboardModel } from "@kissnotes/types";
import useSWR from "swr";
import { ElementType } from "react";

const getLoginHref = () => {
  const referrer = window.location.pathname;
  return referrer && referrer !== "/"
    ? `/login?referrer=${referrer}`
    : "/login";
};

interface Stats {
  id: number;
  value: number;
  Icon: ElementType;
  tooltip: string;
}

const Stats = ({
  stats,
  isLoading,
}: {
  stats: Stats[];
  isLoading: boolean;
}) => {
  return (
    <div className="flex items-center justify-center gap-3">
      {stats.map(({ id, value, Icon, tooltip }, index) => (
        <Fragment key={id}>
          {isLoading ? (
            <Loading />
          ) : (
            <Tooltip content={tooltip}>
              <div key={id} className="flex items-center gap-2 text-secondary">
                <Icon className="size-5" />
                {value}
              </div>
            </Tooltip>
          )}
          {index < stats.length - 1 && <span>•</span>}
        </Fragment>
      ))}
    </div>
  );
};

const Header = ({ className }: { className?: string }) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { sm } = useBreakpoints();
  const pathname = usePathname();

  const { data, isLoading } = useSWR<DashboardModel>({
    url: "/dashboard/browse",
    params: {},
  });

  const stats: Stats[] = [
    {
      id: 1,
      value: data?.expressions.publishedCount ?? 0,
      Icon: CodeBracketIcon,
      tooltip: "Total expressions",
    },
    {
      id: 2,
      value: data?.users.totalCount ?? 0,
      Icon: UserIcon,
      tooltip: "Total users",
    },
  ];

  if (sm) {
    if (pathname === "/") {
      return <Stats stats={stats} isLoading={isLoading} />;
    } else {
      return null;
    }
  }

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

      <Stats stats={stats} isLoading={isLoading} />

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
