import type { ElementType } from "react";
import type { ShortcutDef } from "@/hooks/useShortcut";
import type { ModName } from ".";

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
  pill?: boolean;
}

const Shortcut = ({ shortcut, className, pill }: ShortcutProps) => {
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
    <div className={`max-sm:hidden ${className}`}>
      <div
        className={`overflow-hidden flex justify-center items-center gap-0.5  ${pill ? "rounded-full" : "rounded-lg"}`}
      >
        {shortcutKeys.map((key, i) => (
          // biome-ignore lint/suspicious/noArrayIndexKey: don't care
          <p key={i} className="text-xs font-extrabold">
            <span
              className={`min-w-6 min-h-6 bg-secondary flex justify-center items-center px-2`}
            >
              <span className="text-dark">{key}</span>
            </span>
          </p>
        ))}
      </div>
    </div>
  );
};

export default Shortcut;
