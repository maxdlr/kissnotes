"use client";
import useAuth from "@/contexts/AuthContext/useAuth";
import useToasts from "@/contexts/ToastsContext";
import { getUsername } from "@/utils/userUtils";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";

interface UserProfileProtectedLayoutProps {
  children?: React.ReactNode;
}
const ProtectedLayout = ({ children }: UserProfileProtectedLayoutProps) => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { addToast } = useToasts();

  const isAuthorized = !!user && user.type === "admin";

  useEffect(() => {
    if (loading) return;

    if (!isAuthorized) {
      addToast({
        type: "error",
        title: "Nope",
        message: "You are not authorized to be here.",
      });
      router.push(`/`);
    }
  }, [loading, user, isAuthorized, addToast, router]);

  if (!isAuthorized) return null;

  return children;
};
export default ProtectedLayout;
