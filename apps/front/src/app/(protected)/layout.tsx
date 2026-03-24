"use client";

import { useParams, usePathname } from "next/navigation";
import useAuth from "@/hooks/AuthProvider";
import { getHandle, getUsername } from "@/utils/getProfileHref";

const ProtectedLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  const { handle } = useParams();
  const { isAuthUser } = useAuth();

  if (
    pathname !== `/${getHandle(handle)}` &&
    !isAuthUser({ username: getUsername(handle) as string })
  ) {
    window.location.href = "/";
    return null;
  }

  return children;
};
export default ProtectedLayout;
