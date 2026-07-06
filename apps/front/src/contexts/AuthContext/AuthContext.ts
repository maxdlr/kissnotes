import type { KissResponseError, UserModel } from "@kissnotes/types";
import { createContext } from "react";
import type { KeyedMutator } from "swr";

interface AuthContextProps {
  user?: UserModel;
  loading: boolean;
  refreshMe: KeyedMutator<UserModel | undefined>;
  isAuthUser: (givenUser?: Partial<UserModel>) => boolean;
  logIn: (credentials: {
    username: string;
    password: string;
  }) => Promise<{ error?: KissResponseError }>;
  signUp: (credentials: {
    email: string;
    username: string;
    password: string;
  }) => Promise<KissResponseError | undefined>;
  logOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export default AuthContext;
