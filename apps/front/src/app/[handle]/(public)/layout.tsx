"use client";
import { UserProvider } from "@/contexts/UserContext";
import { useParams } from "next/navigation";

interface UserProfilePublicLayoutProps {
  children?: React.ReactNode;
  modal?: React.ReactNode;
  currentHandle?: string;
}

const UserProfilePublicLayout = ({
  children,
  modal,
}: UserProfilePublicLayoutProps) => {
  const { handle } = useParams();
  return (
    <UserProvider handle={handle}>
      {modal}
      {children}
    </UserProvider>
  );
};
export default UserProfilePublicLayout;
