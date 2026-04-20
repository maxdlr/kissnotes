"use client";
import type { UserModel } from "@kissnotes/types";
import { createContext, useContext } from "react";
import useSWR, { mutate } from "swr";
import axios from "@/services/axios";

const isDev = process.env.NODE_ENV === "development";

const ME_RETRY_COUNT_KEY = "me_retry_count";
const MAX_ME_RETRIES = 2;
const isClient = typeof window !== "undefined";

const getMeRetryCount = () =>
  isClient
    ? parseInt(sessionStorage.getItem(ME_RETRY_COUNT_KEY) ?? "0", 10)
    : 0;

const incrementMeRetryCount = () =>
  isClient &&
  sessionStorage.setItem(ME_RETRY_COUNT_KEY, String(getMeRetryCount() + 1));

const resetMeRetryCount = () =>
  isClient && sessionStorage.removeItem(ME_RETRY_COUNT_KEY);

interface AuthProviderProps {
  children: React.ReactNode;
}

interface AuthContextProps {
  user?: UserModel;
  isAuthUser: ({ username, id, email }: Partial<UserModel>) => boolean;
  logIn: (credentials: { username: string; password: string }) => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const { data: user } = useSWR<UserModel>(
    { url: "/me" },
    {
      onSuccess: () => resetMeRetryCount(),
      onError: () => incrementMeRetryCount(),
      shouldRetryOnError: true,
      errorRetryCount: isDev ? Infinity : MAX_ME_RETRIES,
      errorRetryInterval: isDev ? 3000 : 0,
      isPaused: () => !isDev && getMeRetryCount() >= MAX_ME_RETRIES,
    },
  );

  const isAuthUser = (givenUser: Partial<UserModel>) => {
    if (!givenUser || !user) return false;
    const { username, id, email } = givenUser;
    return (
      user?.id === id || user?.username === username || user?.email === email
    );
  };

  const logIn = (credentials: { username: string; password: string }) =>
    axios.post("/login", credentials).then(() => mutate({ url: "/me" }));

  const value = { user, isAuthUser, logIn };

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
