"use client";

import { useParams, usePathname } from "next/navigation";
import useAuth from "@/hooks/AuthProvider";
import { getHandle, getUsername } from "@/utils/getProfileHref";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { handle } = useParams();
  const { isAuthUser, user } = useAuth();

  const isPrivate = pathname !== `/${getHandle(handle)}`;
  const isAuth =
    user && isAuthUser({ username: getUsername(handle) as string });
  const isAllowed = (isPrivate && isAuth) || !isPrivate;

  if (user && !isAllowed) {
    window.location.href = "/";
    return null;
  }

  return children;
};
export default ProtectedLayout;
