"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import type { UserModel } from "@kissnotes/types";
import type { ParamValue } from "next/dist/server/request/params";
import { createContext, useContext, useEffect } from "react";
import useRead from "@/hooks/bread/useRead";
import { getUsername } from "@/utils/userUtils";
import { useRouter } from "next/navigation";
import useToasts from "@/contexts/ToastsContext";

export interface UserContextProps {
  user?: UserModel;
  loading: boolean;
}

export interface UserProviderProps {
  children: React.ReactNode;
  handle: string | ParamValue;
}

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export const UserProvider = ({ children, handle }: UserProviderProps) => {
  const router = useRouter();
  const {
    data: user,
    loading,
    error,
  } = useRead<UserModel>("users", {
    username: getUsername(handle),
  });

  const { addToast } = useToasts();

  useEffect(() => {
    if (error) {
      addToast({
        type: "error",
        Icon: XMarkIcon,
        message:
          error.status === 404 ? "User not found" : "Something went wrong",
      });
      router.push("/");
    }
  }, [error, router, addToast, user]);

  const value = { user, loading };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export default useUser;
