import { ExpressionToken, UserModel } from "@kissnotes/types";

export type SidebarValue =
  | {
      tokens?: ExpressionToken[];
      author?: UserModel | null;
      search?: string;
      saved?: boolean;
      native?: boolean;
      nativeOnly?: boolean;
    }
  | undefined;

export interface ExpressListSideBarProps {
  className?: string;
  tokenOptions: ExpressionToken[];
  authorOptions: UserModel[];
  onChange: (filters: SidebarValue) => void;
  value: SidebarValue;
}
