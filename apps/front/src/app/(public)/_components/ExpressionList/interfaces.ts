import type { ExpressionModel } from "@kissnotes/types";
import type { SidebarValue } from "@/app/(public)/_components/ExpressionListSidebar/ExpressionListSidebar";
import { ReactNode } from "react";

export interface ExpressionListProps {
  expressions: ExpressionModel[];
  className?: string;
  filters?: SidebarValue;
  onFilterChange?: (filters: SidebarValue) => void;
  startCollapsed?: boolean;
  loading?: boolean;
  urlScope?: string;
  openModals?: boolean;
  ActionSlot?: ReactNode;
  emptyMsg?: string | ReactNode;
}
