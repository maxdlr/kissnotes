"use client";
import useAuth from "@/contexts/AuthContext/useAuth";
import useToasts from "@/contexts/ToastsContext";
import { getUsername } from "@/utils/userUtils";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

interface UserProfileProtectedLayoutProps {
  children?: React.ReactNode;
}
const UserProfileProtectedLayout = ({
  children,
}: UserProfileProtectedLayoutProps) => {
  const { user, loading } = useAuth();
  const { handle } = useParams();
  const router = useRouter();
  const { addToast } = useToasts();

  const isAuthorized = !!user && user.username === getUsername(handle);

  useEffect(() => {
    if (loading || !user) return;

    if (!isAuthorized) {
      addToast({
        type: "error",
        title: "Nope",
        message: "You are not authorized to view this page.",
      });
      router.push(`/`);
    }
  }, [loading, user, isAuthorized, addToast, router]);

  if (!isAuthorized) return null;

  return children;
};
export default UserProfileProtectedLayout;
