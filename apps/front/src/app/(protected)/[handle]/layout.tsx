"use client";
import { useParams } from "next/navigation";
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
  return (
    <UserProvider handle={handle}>
      {modal}
      {header}
      {children}
    </UserProvider>
  );
};
export default ProfilePageLayout;
