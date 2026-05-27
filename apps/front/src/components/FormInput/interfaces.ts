import type {
  ChangeEvent,
  ElementType,
  FocusEventHandler,
  ReactNode,
  Ref,
  RefObject,
} from "react";
import type { ModName } from "@/components/ShortCut";
import type { ShortcutDef } from "@/hooks/useShortcut";
import type { KissChangeEvent, KissClickEvent } from "@/types/form.types";

export interface FormInputProps {
  placeholder?: string | ReactNode;
  inputClassName?: string;
  containerClassName?: string;
  className?: string;
  value?: string | number | boolean;
  variant?: "fill" | "outline" | "ghost";
  onClick?: (e?: KissClickEvent) => void;
  Icon?: ElementType;
  shortcut?: ShortcutDef;
  name: string;
  label?: string | ReactNode;
  onChange: (event: KissChangeEvent) => void;
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
    | "password";
  labelIn?: boolean;
  labelBg?: string;
  ref?: RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  required?: boolean;
  errors?: string[];
  EndChild?: ReactNode;
  StartChild?: ReactNode;
}

export interface InputTextProps {
  placeholder?: string;
  className?: string;
  value?: string;
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
}
