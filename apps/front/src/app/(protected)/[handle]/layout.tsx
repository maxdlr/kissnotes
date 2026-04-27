"use client";
import { useParams, usePathname } from "next/navigation";
import useAuth from "@/contexts/AuthContext/useAuth";
import { getUsername } from "@/utils/userUtils";
import { UserProvider } from "./hooks/UserContext";

interface ProfilePageLayoutProps {
  children?: React.ReactNode;
  modal?: React.ReactNode;
  header?: React.ReactNode;
  currentHandle?: string;
}

const ProfilePageLayout = ({
  children,
  modal,
  header,
}: ProfilePageLayoutProps) => {
  const { handle } = useParams();
  const pathname = usePathname();
  const { isAuthUser, user } = useAuth();

  const privateUris = [`settings`];

  const isPrivate = privateUris.some((uri) => pathname.includes(uri));
  const isAuth =
    user && isAuthUser({ username: getUsername(handle) as string });
  const isAllowed = (isPrivate && isAuth) || !isPrivate;

  if (!isAllowed) {
    window.location.href = "/";
    return null;
  }
  return (
    <UserProvider handle={handle}>
      {modal}
      {header}
      {children}
    </UserProvider>
  );
};
export default ProfilePageLayout;
