import type { ChangeEvent, ElementType, FocusEventHandler, Ref } from "react";
import type { ModName } from "../ShortCut";

export interface InputTextProps {
  placeholder?: string;
  className?: string;
  value?: string;
  variant?: "fill" | "outline" | "ghost";
  onClick?: (e?: Event | React.MouseEvent) => void;
  Icon?: ElementType;
  shortcut?: (string | ElementType | ModName)[];
  name: string;
  label?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  disabled?: boolean;
  type?: "text" | "search" | "email";
  ref?: Ref<HTMLInputElement | null>;
}
