import type { UserModel } from "@kissnotes/types";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import useSWR, { type SWRConfiguration } from "swr";
import privateUris from "@/enums/privateUris";
import useAxios from "@/hooks/useAxios";
import useToasts from "../ToastsContext";
import AuthContext from "./AuthContext";

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

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { addToast } = useToasts();

  const pathnameRef = useRef(pathname);
  pathnameRef.current = pathname;

  const redirectToHomeIfPrivate = useCallback(() => {
    const isPrivate = privateUris.some((uri) => uri.test(pathnameRef.current));
    if (isPrivate) {
      router.push("/");
      addToast({
        type: "success",
        title: "Logged out",
        message: "You have been logged out successfully.",
      });
    }
  }, [router, addToast]);

  const isPaused = useCallback(
    () => !isDev && getMeRetryCount() >= MAX_ME_RETRIES,
    [],
  );

  useEffect(() => {
    if (!isDev && getMeRetryCount() >= MAX_ME_RETRIES) {
      setLoading(false);
    }
  }, []);

  const { postData: postLogin } = useAxios("/login");
  const { postData: postLogout } = useAxios("/logout");
  const { postData: postSignUp } = useAxios("/signup");

  const { data: user, mutate } = useSWR<UserModel>({ url: "/me" }, {
    onSuccess: () => {
      resetMeRetryCount();
      setLoading(false);
    },
    onError: () => {
      incrementMeRetryCount();
      setLoading(false);
      redirectToHomeIfPrivate();
    },
    shouldRetryOnError: true,
    errorRetryCount: isDev ? Infinity : MAX_ME_RETRIES,
    errorRetryInterval: isDev ? 3000 : 0,
    isPaused,
    onLoadingSlow: () => {
      setLoading(false);
      redirectToHomeIfPrivate();
    },
    revalidateOnFocus: true,
    revalidateIfStale: true,
    revalidateOnMount: true,
  } as SWRConfiguration<UserModel>);

  const isAuthUser = (givenUser?: Partial<UserModel>) => {
    if (!givenUser || !user) return false;
    const { username, id, email } = givenUser;
    return (
      user?.id === id || user?.username === username || user?.email === email
    );
  };

  const refreshMe = useCallback(() => mutate(undefined), [mutate]);

  const logIn = async (credentials: { username: string; password: string }) => {
    const r = await postLogin(credentials);
    resetMeRetryCount();
    refreshMe();
    return r;
  };

  const logOut = async () => {
    await postLogout({});
    refreshMe();
    redirectToHomeIfPrivate();
  };

  const signUp = async (credentials: {
    email: string;
    username: string;
    password: string;
  }) => {
    const { error } = await postSignUp(credentials);
    resetMeRetryCount();
    refreshMe();
    return error;
  };

  const value = { user, loading, isAuthUser, logIn, logOut, signUp, refreshMe };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
