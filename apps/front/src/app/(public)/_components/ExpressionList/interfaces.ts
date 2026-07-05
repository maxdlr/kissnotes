import type { SidebarValue } from "@/app/(public)/_components/ExpressionListSidebar";
import type { ExpressionModel, ExpressionToken, UserModel } from "@kissnotes/types";
import { ReactNode } from "react";

export type ListExpression = Omit<Partial<ExpressionModel>, "author"> &
  Pick<ExpressionModel, "id" | "title"> & {
    native?: boolean;
    author?: { id?: Id; username: string } | UserModel;
  };

export interface ExpressionListProps {
  expressions: ListExpression[];
  className?: string;
  filters?: SidebarValue;
  onFilterChange?: (filters: SidebarValue) => void;
  startCollapsed?: boolean;
  loading?: boolean;
  urlScope?: string;
  openModals?: boolean;
  ActionSlot?: ReactNode;
  emptyMsg?: string | ReactNode;
  tokenOptions?: ExpressionToken[];
  authorOptions?: UserModel[];
}
