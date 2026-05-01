import type { UserModel } from "@kissnotes/types";
import { createContext } from "react";
import type { KeyedMutator } from "swr";

interface AuthContextProps {
  user?: UserModel;
  loading: boolean;
  mutateUser: KeyedMutator<UserModel>;
  isAuthUser: (givenUser: Partial<UserModel>) => boolean;
  logIn: (credentials: { username: string; password: string }) => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export default AuthContext;
