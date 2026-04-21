import type { ElementType } from "react";
import type { ShortcutDef } from "@/hooks/useShortcut";
import type { VariantDirection } from "./Button";

export interface ButtonProps {
  id?: string;
  label?: string | number | React.ReactNode;
  href?: string;
  className?: string;
  labelClassName?: string;
  variant?:
    | "fill"
    | "outline"
    | "outline-accent"
    | "ghost"
    | "fill-accent"
    | "ghost-reveal";
  onClick?: (event?: React.MouseEvent) => void;
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
}
