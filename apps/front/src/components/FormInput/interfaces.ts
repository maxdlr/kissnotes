import type { ModName } from "@/components/ShortCut";
import type { ShortcutDef } from "@/hooks/useShortcut";
import type { KissChangeEvent, KissClickEvent } from "@/types/form.types";
import type {
  ChangeEvent,
  ElementType,
  FocusEventHandler,
  ReactNode,
  Ref,
  RefObject,
} from "react";

export interface FormInputProps<T> {
  options?: T[];
  /** For code type, defines the height of the code editor */
  codeHeight?: string;
  property?: keyof T;
  rows?: number;
  placeholder?: string | ReactNode;
  inputClassName?: string;
  containerClassName?: string;
  className?: string;
  value?: string | number | boolean | T;
  variant?: "fill" | "outline" | "ghost";
  onClick?: (e?: KissClickEvent) => void;
  Icon?: ElementType;
  shortcut?: ShortcutDef;
  name: string;
  label?: string | ReactNode;
  onChange: (event: KissChangeEvent | KissChangeEvent<T>) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
  disabled?: boolean;
  type?:
    | "textarea"
    | "text"
    | "number"
    | "search"
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "email"
    | "file"
    | "hidden"
    | "dropdown"
    | "password"
    | "code";
  labelIn?: boolean;
  labelBg?: string;
  ref?: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  required?: boolean;
  errors?: string[];
  EndChild?: ReactNode;
  StartChild?: ReactNode;
  autoFocus?: boolean;
}

export interface InputTextProps<T = string> {
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
  value?: string | number | boolean | T;
  variant?: "fill" | "outline" | "ghost";
  onClick?: (e?: KissClickEvent) => void;
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

export interface InputTextAreaProps {
  autoFocus?: boolean;
  placeholder?: string;
  className?: string;
  value?: string;
  variant?: "fill" | "outline" | "ghost";
  onClick?: (e?: KissClickEvent) => void;
  Icon?: ElementType;
  shortcut?: (string | ElementType | ModName)[];
  name: string;
  label?: string;
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onFocus?: FocusEventHandler<HTMLTextAreaElement>;
  disabled?: boolean;
  ref?: Ref<HTMLTextAreaElement | null>;
  rows?: number;
}

export interface FormDropdownProps<T> {
  ref?: RefObject<HTMLDivElement | null>;
  label?: string | ReactNode;
  name?: string;
  required?: boolean;
  placeholder?: string | ReactNode;
  className?: string;
  property?: keyof T;
  options?: T[];
  value?: T;
  disabled?: boolean;
  onChange?: (e: KissChangeEvent<T>) => void;
  onOpen?: () => void;
  onClose?: () => void;
  onHover?: (hovered: boolean) => void;
  onTap?: (tapped: boolean) => void;
  open?: boolean;
}

export interface InputCodeProps {
  value: string;
  height?: string;
  onChange: (e: KissChangeEvent) => void;
  onFocus?: () => void;
  onUnfocus?: () => void;
  className?: string;
}
