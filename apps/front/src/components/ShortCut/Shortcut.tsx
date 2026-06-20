import type { ElementType } from "react";
import { useShortcut, type ShortcutDef } from "@/hooks/useShortcut";
import { motion } from "motion/react";
import type { ModName } from ".";
import { ColorClass } from "@/types/style.types";

const mods: Map<ModName, string> = new Map();
mods.set("cmd", "⌘");
mods.set("opt", "⌥");
mods.set("shift", "⇧");
mods.set("capslock", "⇪");
mods.set("enter", "↩");
mods.set("ctrl", "⌃");
mods.set("backspace", "⌫");
mods.set("del", "⌦");
mods.set("tab", "⇥");
mods.set("up", "↑");
mods.set("down", "↓");
mods.set("left", "←");
mods.set("cmd", "⌘");
mods.set("right", "→");

interface ShortcutProps {
  shortcut: ShortcutDef;
  className?: string;
  keyClassName?: string;
  pill?: boolean;
  active?: boolean;
  onTrigger?: (e?: KeyboardEvent) => void;
  bgColor?: ColorClass;
  fgColor?: ColorClass;
}

const Shortcut = ({
  shortcut,
  className,
  keyClassName = "",
  pill,
  onTrigger,
  bgColor = "secondary",
  fgColor = "dark",
}: ShortcutProps) => {
  const { active } = useShortcut(shortcut, (e) => onTrigger?.(e));

  const shortcutKeys = shortcut?.keys?.map((key) => {
    if (typeof key !== "string") {
      const KeyElement = key as ElementType;
      return <KeyElement key={key} className="size-4" />;
    }

    if (mods.has(key as ModName)) {
      return mods.get(key as ModName);
    }

    return key;
  });

  return (
    <motion.div className={`max-sm:hidden ${className}`}>
      <motion.div
        className={`overflow-hidden flex justify-center items-center gap-0.5  ${pill ? "rounded-full" : "rounded-lg"}`}
        animate={{
          scale: active ? 0.95 : 1,
          rotate: active ? -2 : 0,
        }}
      >
        {shortcutKeys.map((key, i) => (
          <motion.p
            // biome-ignore lint/suspicious/noArrayIndexKey: This is a static list of keys, so using the index as a key is acceptable.
            key={i}
            className={`text-xs font-extrabold ${keyClassName}`}
            initial={{
              backgroundColor: "var(--color-secondary)",
            }}
            animate={{
              backgroundColor: active
                ? "var(--color-emphasis)"
                : `var(--color-${bgColor})`,
            }}
          >
            <span
              className={`min-w-6 min-h-6 flex justify-center items-center px-2`}
            >
              <span style={{ color: `var(--color-${fgColor})` }}>{key}</span>
            </span>
          </motion.p>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Shortcut;
