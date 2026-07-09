import { ReactNode } from "react";

export interface CollapsibleProps {
  children: ReactNode;
  headerChild?: ReactNode;
  /** Whether the content is collapsed or not, should be used with a state (default: false) */
  collapsed: boolean;
  /** Additional class names applied to the root container. */
  className?: string;
  horizontal?: boolean;
}
