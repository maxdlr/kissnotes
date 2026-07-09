import { ShortcutDef } from "@/hooks/useShortcut";
import { ColorClass } from "@/types/style.types";

export interface ShortcutProps {
  shortcut: ShortcutDef;
  className?: string;
  keyClassName?: string;
  pill?: boolean;
  active?: boolean;
  onTrigger?: (e?: KeyboardEvent) => void;
  bgColor?: ColorClass;
  fgColor?: ColorClass;
}
