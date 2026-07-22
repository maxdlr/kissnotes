import type { ComponentType, ReactNode, SVGProps } from "react";
import type { BubblePosition } from "../Bubble/interfaces";

export type TooltipSize = "sm" | "md" | "lg" | "xl";

export interface TooltipProps {
  content: string;
  position?: BubblePosition;
  size?: TooltipSize;
  className?: string;
  parentClassName?: string;
  /** Delay in ms before showing (default: 400) */
  showDelay?: number;
  /** Delay in ms before hiding (default: 150) */
  hideDelay?: number;
  Icon?: ComponentType<SVGProps<SVGSVGElement>>;
  children?: ReactNode;
}
