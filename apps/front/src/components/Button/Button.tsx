/** biome-ignore-all lint/suspicious/noExplicitAny: <explanation> */
"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ElementType } from "react";
import { type ShortcutDef, useShortcut } from "@/hooks/useShortcut";
import { Shortcut } from "../ShortCut";

type VariantSet = {
  initial: object;
  animate: object;
  exit: object;
};

const scaledDown = 0.95;
const scaledUp = 1.05;
const rotated = 10;
const distance = 20;

const animate = { opacity: 1, scale: 1, y: 0, x: 0, rotate: 0 };
const hidden = { opacity: 0, scale: scaledDown, rotate: rotated };

export const variants = {
  up: {
    initial: { ...hidden, y: distance },
    animate,
    exit: { ...hidden, y: distance },
  },
  down: {
    initial: { ...hidden, y: -distance },
    animate,
    exit: { ...hidden, y: -distance },
  },
  left: {
    initial: { ...hidden, rotate: 0, x: distance },
    animate,
    exit: { ...hidden, rotate: 0, x: distance },
  },
  right: {
    initial: { ...hidden, rotate: 0, x: -distance },
    animate,
    exit: { ...hidden, rotate: 0, x: distance },
  },
  scale: { initial: { ...hidden }, animate, exit: { ...hidden } },
} satisfies Record<string, VariantSet>;

export type VariantDirection = keyof typeof variants;

export interface ButtonProps {
  id?: string;
  label?: string | number | React.ReactNode;
  href?: string;
  className?: string;
  variant?: "fill" | "outline" | "ghost" | "fill-accent" | "ghost-reveal";
  onClick?: (event?: React.MouseEvent) => void;
  type?: "button" | "reset" | "submit";
  Icon?: ElementType;
  HoverIcon?: ElementType;
  shortcut?: ShortcutDef;
  size?: "md" | "sm" | "lg";
  animDirection?: VariantDirection;
  hoverUp?: boolean;
}

const MotionLink = motion(Link);

const defaultVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const interactionVariants: Record<
  NonNullable<ButtonProps["variant"]>,
  { hover: object; tap: object }
> = {
  "fill-accent": {
    hover: {
      backgroundColor: "var(--color-accent)",
      borderColor: "var(--color-secondary)",
      color: "var(--color-primary)",
      scale: scaledUp,
    },
    tap: {
      backgroundColor: "var(--color-accent)",
      borderColor: "var(--color-secondary)",
      color: "var(--color-primary)",
      scale: scaledDown,
    },
  },
  fill: {
    hover: {
      backgroundColor:
        "color-mix(in srgb, var(--color-secondary) 50%, transparent)",
      borderColor: "var(--color-primary)",
      color: "var(--color-primary)",
      scale: scaledUp,
    },
    tap: {
      backgroundColor:
        "color-mix(in srgb, var(--color-secondary) 50%, transparent)",
      borderColor: "var(--color-primary)",
      color: "var(--color-primary)",
      scale: scaledDown,
    },
  },
  outline: {
    hover: {
      borderColor: "var(--color-primary)",
      color: "var(--color-primary)",
      scale: scaledUp,
    },
    tap: {
      borderColor: "var(--color-primary)",
      color: "var(--color-primary)",
      scale: scaledDown,
    },
  },
  ghost: {
    hover: { color: "var(--color-secondary)", scale: scaledUp },
    tap: { color: "var(--color-primary)", scale: scaledDown },
  },
  "ghost-reveal": {
    hover: {
      backgroundColor: "var(--color-accent)",
      color: "var(--color-primary)",
      scale: scaledUp,
    },
    tap: {
      backgroundColor: "var(--color-secondary)",
      color: "var(--color-darker)",
      scale: scaledDown,
    },
  },
};

const Button = ({
  id,
  label,
  href,
  className = "",
  variant = "fill",
  type,
  onClick,
  Icon,
  HoverIcon,
  shortcut,
  size = "md",
  animDirection,
  hoverUp = false,
}: ButtonProps) => {
  const router = useRouter();

  useShortcut(shortcut, () => {
    if (href) router.push(href);
    else onClick?.();
  });

  const sizeStyles = {
    md: {
      text: "text-base",
      gap: "gap-3",
      padding: "py-3 px-4",
      iconSize: "size-6",
    },
    sm: {
      text: "text-sm",
      gap: "gap-1",
      padding: `${shortcut ? "pe-1! ps-2!" : "px-2"} py-1`,
      iconSize: "size-5",
    },
    lg: {
      text: "text-lg",
      gap: "gap-4",
      padding: "py-4 px-5",
      iconSize: "size-7",
    },
  };

  const s = sizeStyles[size];
  const baseStyle = `cursor-pointer rounded-3xl w-fit ${s.padding}`;

  const variantStyles = {
    "fill-accent": "border border-accent bg-accent/20 rounded-full",
    fill: "bg-secondary/20 border border-secondary",
    outline: "border border-secondary",
    ghost: "p-0!",
    "ghost-reveal": "px-2!",
  };

  const safeId =
    id ??
    (typeof label === "string" || typeof label === "number"
      ? `${String(label).toLowerCase()}-btn`
      : undefined);

  const motionProps = animDirection ? variants[animDirection] : defaultVariants;
  const { hover, tap } = interactionVariants[variant];

  const content =
    Icon || label ? (
      <span className={`flex justify-center items-center ${s.gap} ${s.text}`}>
        {Icon && (
          <span className="group">
            <span className={HoverIcon ? "group-hover:hidden" : ""}>
              <Icon className={s.iconSize} />
            </span>
            {HoverIcon && (
              <span className="group-hover:block hidden">
                <HoverIcon className={s.iconSize} />
              </span>
            )}
          </span>
        )}
        {label && (
          <span className="font-semibold whitespace-nowrap">{label}</span>
        )}
        {shortcut && (
          <Shortcut
            shortcut={shortcut}
            className="ps-1"
            pill={size === "sm" && shortcut.keys.length === 1}
          />
        )}
      </span>
    ) : null;

  if (!content) return null;

  if (href) {
    return (
      <MotionLink
        {...motionProps}
        id={safeId}
        href={href}
        className={`block ${baseStyle} ${variantStyles[variant]} ${className}`}
        whileHover={hoverUp ? hover : { ...(hover as any), scale: undefined }}
        whileTap={tap as any}
      >
        {content}
      </MotionLink>
    );
  }

  return (
    <motion.button
      {...motionProps}
      id={safeId}
      type={type}
      onClick={onClick}
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      whileHover={hoverUp ? hover : { ...(hover as any), scale: undefined }}
      whileTap={tap as any}
    >
      {content}
    </motion.button>
  );
};

export default Button;
