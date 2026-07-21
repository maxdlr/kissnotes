import type { ElementType } from "react";
import type { ShortcutDef } from "@/hooks/useShortcut";
import type { KissClickEvent } from "@/types/form.types";
import type { VariantDirection } from "./Button";
import { TooltipProps } from "../Tooltip/interfaces";

export type VariantType =
  | "fill"
  | "outline"
  | "outline-accent"
  | "ghost"
  | "ghost-secondary"
  | "fill-accent"
  | "ghost-reveal";

export interface ButtonProps {
  id?: string;
  label?: string | number | React.ReactNode;
  href?: string;
  className?: string;
  iconSize?: string;
  labelClassName?: string;
  variant?: VariantType;
  onClick?: (e?: KissClickEvent) => void;
  type?: "button" | "reset" | "submit";
  Icon?: ElementType;
  HoverIcon?: ElementType;
  shortcut?: ShortcutDef;
  size?: "md" | "sm" | "lg";
  animDirection?: VariantDirection;
  hoverUp?: boolean;
  disabled?: boolean;
  loading?: boolean;
  danger?: boolean;
  bare?: boolean;
  iconPosition?: "left" | "right";
  tooltip?: TooltipProps;
  onHoverStart?: () => void;
  onHoverEnd?: () => void;
}

export type VariantSet = {
  initial: object;
  animate: object;
  exit: object;
};
