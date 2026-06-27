import { ExpressionToken, UserModel, ExpressionModel } from "@kissnotes/types";

export type SidebarValue =
  | {
      tokens?: ExpressionToken[];
      author?: UserModel | null;
      search?: string;
    }
  | undefined;

export interface ExpressListSideBarProps {
  className?: string;
  expressions: ExpressionModel[];
  onChange: (filters: SidebarValue) => void;
  value: SidebarValue;
}
