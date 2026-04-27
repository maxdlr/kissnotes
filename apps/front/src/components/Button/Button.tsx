/** biome-ignore-all lint/suspicious/noExplicitAny: dont care */
"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { KissClickEvent } from "@/types/form.types";
import Shortcut from "../ShortCut";
import type { ButtonProps } from "./interfaces";

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

const MotionLink = motion(Link);

const defaultVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
};

const interactionVariants: Record<
  NonNullable<ButtonProps["variant"]>,
  {
    resting: object;
    hover: {
      backgroundColor?: string | number | undefined;
      borderColor?: string | number | undefined;
      color?: string | undefined;
      scale?: string | number;
    };
    tap: object;
  }
> = {
  "fill-accent": {
    resting: {},
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
    resting: {},
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
    resting: {},
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
  "outline-accent": {
    resting: {},
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
    resting: { color: "var(--color-accent)" },
    hover: { color: "var(--color-secondary)", scale: scaledUp },
    tap: { color: "var(--color-primary)", scale: scaledDown },
  },
  "ghost-reveal": {
    resting: {
      color: "var(--color-accent)",
      backgroundColor: "transparent",
    },
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
  type = "button",
  onClick,
  Icon,
  HoverIcon,
  shortcut,
  size = "md",
  animDirection,
  hoverUp = false,
  disabled = false,
  loading = false,
  danger = false,
  labelClassName = "",
  iconPosition = "left",
}: ButtonProps) => {
  const router = useRouter();

  const handleOnClick = (e?: KissClickEvent) => {
    if (disabled || loading) {
      e?.preventDefault();
      return;
    }
    if (href) router.push(href);
    else onClick?.(e);
  };

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
  const baseStyle = `rounded-3xl w-fit ${s.padding}`;

  const disabledClass = `${disabled ? "cursor-not-allowed! opacity-50!" : ""} ${loading ? "cursor-wait! opacity-75! border-emphasis!" : ""}`;

  const variantStyles = {
    "fill-accent": "border border-accent bg-accent/20",
    fill: "bg-secondary/20 border border-secondary",
    outline: "border border-secondary",
    "outline-accent": "border border-accent",
    ghost: "p-0!",
    "ghost-reveal": "px-2!",
  };

  const safeId =
    id ??
    (typeof label === "string" || typeof label === "number"
      ? `${String(label).toLowerCase()}-btn`
      : undefined);

  const motionProps = animDirection ? variants[animDirection] : defaultVariants;
  const { resting, hover, tap } = interactionVariants[variant];

  const animateWithResting = { ...motionProps.animate, ...resting };

  const iconContent = Icon && (
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
  );

  const content =
    Icon || label ? (
      <span
        className={`flex justify-center items-center ${href ? "h-full" : ""} ${s.gap} ${s.text}`}
      >
        {iconPosition === "left" && iconContent}
        {label && (
          <span
            className={`font-semibold text-nowrap leading-none ${labelClassName}`}
          >
            {label}
          </span>
        )}
        {iconPosition === "right" && iconContent}
        {shortcut && (
          <Shortcut
            shortcut={shortcut}
            onTrigger={handleOnClick}
            className="ps-1"
            pill={size === "sm"}
          />
        )}
      </span>
    ) : null;

  const loadingContent = (
    <span className={`flex justify-center items-center ${s.gap} ${s.text}`}>
      <motion.div
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          background: "var(--color-emphasis)",
        }}
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.4, 1, 0.4],
        }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </span>
  );

  if (!content) return null;

  const ButtonEl = href ? MotionLink : motion.button;

  return (
    <ButtonEl
      initial={motionProps.initial}
      animate={animateWithResting}
      exit={motionProps.exit}
      id={safeId}
      href={href ? href : undefined}
      type={type}
      className={`inline-block cursor-pointer ${baseStyle} ${variantStyles[variant]} ${disabledClass} ${className}`}
      whileHover={
        hoverUp && !disabled
          ? hover
          : {
              ...{
                ...hover,
                backgroundColor: danger
                  ? "var(--color-danger)"
                  : hover.backgroundColor,
              },
              scale: undefined,
            }
      }
      whileTap={!disabled ? (tap as any) : undefined}
      onClick={href ? undefined : handleOnClick}
    >
      {loading ? loadingContent : content}
    </ButtonEl>
  );
};

export default Button;
