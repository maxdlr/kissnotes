import { ShortcutDef } from "@/hooks/useShortcut";
import { ElementType } from "react";

export interface ToggleButton {
  value: string;
  label?: string;
  Icon?: ElementType;
  HoverIcon?: ElementType;
  shortcut?: ShortcutDef;
  className?: string;
}

export interface ToggleButtonsProps {
  buttons: ToggleButton[];
  value: string;
  onChange: (value: string) => void;
  size?: "sm" | "md" | "lg";
}
