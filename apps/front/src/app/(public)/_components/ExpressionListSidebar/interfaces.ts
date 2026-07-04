import { ExpressionModel, ExpressionToken, UserModel } from "@kissnotes/types";

export type SidebarValue =
  | {
      tokens?: ExpressionToken[];
      author?: UserModel | null;
      search?: string;
      saved?: boolean;
    }
  | undefined;

export interface ExpressListSideBarProps {
  className?: string;
  expressions: (ExpressionModel & { native: boolean; score: number })[];
  onChange: (filters: SidebarValue) => void;
  value: SidebarValue;
  native?: boolean;
}
