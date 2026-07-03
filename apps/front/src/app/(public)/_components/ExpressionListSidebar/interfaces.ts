import {
  ExpressionToken,
  UserModel,
  ExpressionModel,
  NativeExpressionModel,
} from "@kissnotes/types";

export type SidebarValue =
  | {
      tokens?: ExpressionToken[];
      author?: UserModel | null;
      search?: string;
      saved?: boolean;
      native?: boolean;
    }
  | undefined;

export interface ExpressListSideBarProps {
  className?: string;
  expressions: (ExpressionModel | NativeExpressionModel)[];
  onChange: (filters: SidebarValue) => void;
  value: SidebarValue;
  native?: boolean;
}
