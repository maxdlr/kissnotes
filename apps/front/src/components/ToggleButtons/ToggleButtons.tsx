import Shortcut from "@/components/ShortCut";
import { ShortcutDef } from "@/hooks/useShortcut";
import { motion } from "motion/react";
import { ElementType, useId } from "react";

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

const ToggleButtons = ({
  buttons,
  value,
  onChange,
  size = "md",
}: ToggleButtonsProps) => {
  const layoutId = useId();

  const sizeClass = {
    sm: "px-3 py-2 text-sm",
    md: "px-4 py-3 text-md",
    lg: "px-6 py-4 text-lg",
  }[size];

  const iconSizeClass = {
    sm: "size-3",
    md: "size-4",
    lg: "size-6",
  }[size];

  return (
    <div
      className={`flex items-center justify-center rounded-3xl overflow-hidden border border-accent`}
    >
      {buttons.map((button) => {
        const selected = button.value === value;
        return (
          <motion.button
            key={button.value}
            onClick={() => onChange(button.value)}
            style={{
              scale: 1,
              ...(selected
                ? { color: "var(--color-primary)" }
                : {
                    backgroundColor: "transparent",
                    color: "var(--color-accent)",
                  }),
            }}
            whileHover={{
              scale: 1.05,
              ...(selected
                ? { color: "var(--color-primary)" }
                : {
                    backgroundColor:
                      "color-mix(in srgb, var(--color-secondary) 10%, transparent)",
                    color: "var(--color-secondary)",
                  }),
            }}
            whileTap={{
              ...(selected
                ? {}
                : {
                    scale: 0.95,
                    backgroundColor:
                      "color-mix(in srgb, var(--color-secondary) 10%, transparent)",
                    color: "var(--color-secondary)",
                  }),
            }}
            className={`group relative flex items-center justify-center gap-2 cursor-pointer ${sizeClass}`}
          >
            {selected && (
              <motion.div
                layoutId={layoutId}
                className="absolute inset-0 bg-accent"
              />
            )}
            {(button.Icon || button.label) && (
              <span className="relative z-10 flex justify-center items-center gap-2">
                {button.Icon && (
                  <span>
                    <span
                      className={
                        button.HoverIcon
                          ? selected
                            ? "hidden"
                            : "group-hover:hidden"
                          : ""
                      }
                    >
                      <button.Icon className={iconSizeClass} />
                    </span>
                    {button.HoverIcon && (
                      <span
                        className={
                          selected ? "block" : "group-hover:block hidden"
                        }
                      >
                        <button.HoverIcon className={iconSizeClass} />
                      </span>
                    )}
                  </span>
                )}
                {button.label && (
                  <span
                    className={`font-semibold text-nowrap leading-none ${button.className || ""}`}
                  >
                    {button.label}
                  </span>
                )}
                {button.shortcut && (
                  <Shortcut
                    shortcut={button.shortcut}
                    className="ps-1"
                    pill={size === "sm"}
                  />
                )}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
};
export default ToggleButtons;
