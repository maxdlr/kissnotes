import { ReactNode, CSSProperties } from "react";

export type MasonryBreakpoints = {
  /** column count at each min-width breakpoint (px → columns) */
  [minWidth: number]: number;
};

export interface MasonryGridProps {
  /** Items to lay out – any React nodes */
  children: ReactNode;
  /**
   * Either a fixed column count or a responsive map.
   * @example columns={3}
   * @example columns={{ 0: 1, 640: 2, 1024: 3, 1440: 4 }}
   */
  columns?: number | MasonryBreakpoints;
  /** Gap between items (CSS value, e.g. "16px", "1rem"). Default: "16px" */
  gap?: string;
  /** Extra className applied to the outer wrapper */
  className?: string;
  /** Extra style applied to the outer wrapper */
  style?: CSSProperties;
  /** Called whenever the column count changes */
  onColumnsChange?: (columns: number) => void;
  /** Enable stagger animation on items. Default: false */
  stagger?: boolean;
  /** Delay between each item in seconds. Default: 0.06 */
  staggerDelay?: number;
  /** Vertical slide distance in px. Default: 30 */
  staggerDistance?: number;
}
