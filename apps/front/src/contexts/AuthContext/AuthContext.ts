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
  }) => Promise<string | undefined>;
  signUp: (credentials: {
    email: string;
    username: string;
    password: string;
  }) => Promise<KissResponseError>;
  logOut: () => Promise<string | undefined>;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export default AuthContext;
