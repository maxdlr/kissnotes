"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ElementType } from "react";
import { type ShortcutDef, useShortcut } from "@/hooks/useShortcut";
import { Shortcut } from "../ShortCut";

export interface ButtonProps {
  id?: string;
  label?: string | number | React.ReactNode;
  href?: string;
  className?: string;
  variant?: "fill" | "outline" | "ghost";
  // biome-ignore lint/suspicious/noExplicitAny: fight
  onClick?: (event?: any) => void;
  type?: "button" | "reset" | "submit";
  Icon?: ElementType;
  shortcut?: ShortcutDef;
  size?: "md" | "sm" | "lg";
}
const Button = ({
  id,
  label,
  href,
  className = "",
  variant = "fill",
  type,
  onClick,
  Icon,
  shortcut,
  size = "md",
}: ButtonProps) => {
  const router = useRouter();
  useShortcut(shortcut, () => {
    console.log("shortcut triggered", shortcut?.keys);
    return href ? router.push(href) : onClick?.();
  });

  const sizeStyles: Record<"md" | "sm" | "lg", Record<string, string>> = {
    md: {
      text: "text-base",
      gap: "gap-3",
      padding: "py-3 px-4",
      iconSize: "size-6",
    },
    sm: {
      text: "text-sm",
      gap: "gap-1",
      padding: "py-2 px-3",
      iconSize: "size-5",
    },
    lg: {
      text: "text-lg",
      gap: "gap-4",
      padding: "py-4 px-5",
      iconSize: "size-7",
    },
  };

  const style = `cursor-pointer rounded-3xl w-fit ${sizeStyles[size].padding}`;

  const variantStyles = {
    fill: "bg-secondary/20 border-[1px] border-secondary",
    outline: "border-[1px] border-secondary",
    ghost: "!p-0 hover:text-primary active:text-darker",
  };

  const content = (Icon || label) && (
    <span
      className={`flex justify-center items-center ${sizeStyles[size].gap} ${sizeStyles[size].text}`}
    >
      {Icon && (
        <span>
          <Icon className={`${sizeStyles[size].iconSize}`} />
        </span>
      )}
      {label && (
        <span className="font-semibold whitespace-nowrap">{label}</span>
      )}
      {shortcut && <Shortcut shortcut={shortcut} className="ps-1" />}
    </span>
  );

  if (href && content) {
    return (
      <Link
        className={`block ${style} ${variantStyles[variant]} ${className}`}
        href={href}
      >
        {content}
      </Link>
    );
  }

  if (content) {
    return (
      <button
        id={id || `${label?.toString().toLowerCase()}-btn`}
        type={type}
        onClick={onClick}
        className={`${style} ${variantStyles[variant]} ${className}`}
      >
        {content}
      </button>
    );
  }

  return null;
};

export default Button;
