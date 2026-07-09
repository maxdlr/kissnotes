import { ShortcutDef } from "@/hooks/useShortcut";
import { KissChangeEvent } from "@/types/form.types";

export interface SearchBarProps {
  placeholder?: string;
  inputClassName?: string;
  className?: string;
  value?: string;
  name?: string;
  variant?: "fill" | "outline" | "ghost";
  modalSearcher?: boolean;
  shortcut?: ShortcutDef;
  Icon?: React.ElementType | null;
  onChange?: (e: KissChangeEvent) => void;
}
