"use client";
import type { Id, UserModel } from "@kissnotes/types";
import type { ParamValue } from "next/dist/server/request/params";
import { createContext, useContext, useState } from "react";
import useRead from "@/hooks/bread/useRead";
import { getUsername } from "@/utils/getProfileHref";

export interface UserContextProps {
  user: UserModel;
  loading: boolean;
  expressionId: Id | null;
  setExpressionId: React.Dispatch<React.SetStateAction<Id | null>>;
}

export interface UserProviderProps {
  children: React.ReactNode;
  handle: string | ParamValue;
}

const UserContext = createContext<UserContextProps>({} as UserContextProps);

export const UserProvider = ({ children, handle }: UserProviderProps) => {
  const [expressionId, setExpressionId] = useState<Id | null>(null);
  const { data: user, loading } = useRead<UserModel>("users", {
    username: getUsername(handle),
  });

  if (!user) return null;

  const value = { user, loading, expressionId, setExpressionId };

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
