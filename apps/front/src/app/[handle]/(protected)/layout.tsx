"use client";
import useAuth from "@/contexts/AuthContext/useAuth";
import useToasts from "@/contexts/ToastsContext";
import { getHandle } from "@/utils/userUtils";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

interface UserProfileProtectedLayoutProps {
  children?: React.ReactNode;
}
const UserProfileProtectedLayout = ({
  children,
}: UserProfileProtectedLayoutProps) => {
  const { handle } = useParams();
  const { user } = useAuth();
  const router = useRouter();
  const { addToast } = useToasts();
  const isAuthorized = getHandle(user?.username) === getHandle(handle);

  useEffect(() => {
    if (!isAuthorized) {
      addToast({
        type: "error",
        title: "Nope",
        message: "You are not authorized to view this page.",
      });

      router.push(`/`);
    }
  }, [isAuthorized, addToast, router]);

  if (!isAuthorized) return null;

  return children;
};
export default UserProfileProtectedLayout;
