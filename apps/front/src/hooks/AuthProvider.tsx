"use client";
import type { Id, UserModel } from "@kissnotes/types";
import { createContext, useContext } from "react";
import useSWR from "swr";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextProps {
  user?: UserModel;
  isAuthUser: ({ username, id, email }: Partial<UserModel>) => boolean;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data: user } = useSWR<UserModel>({ url: "/me" });

  const isAuthUser = (givenUser: Partial<UserModel>) => {
    if (!givenUser || !user) return false;
    const { username, id, email } = givenUser;
    return (
      user?.id === id || user?.username === username || user?.email === email
    );
  };

  const value = { user, isAuthUser };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return context;
};

export default useAuth;
