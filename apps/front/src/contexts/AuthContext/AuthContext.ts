import type { UserModel } from "@kissnotes/types";
import { createContext } from "react";

interface AuthContextProps {
  user?: UserModel;
  isUserLoading: boolean;
  isAuthUser: ({ username, id, email }: Partial<UserModel>) => boolean;
  logIn: (credentials: { username: string; password: string }) => void;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export default AuthContext;
