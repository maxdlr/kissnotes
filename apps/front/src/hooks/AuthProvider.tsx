"use client";
import type { UserModel } from "@kissnotes/types";
import { createContext, useContext } from "react";
import useSWR from "swr";

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextProps {
  user: UserModel;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data } = useSWR({ url: "/me" });
  const user = data?.data?.user;
  const value = { user };
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
