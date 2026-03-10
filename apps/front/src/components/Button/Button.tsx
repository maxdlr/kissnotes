"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ElementType } from "react";
import { type ShortcutDef, useShortcut } from "@/hooks/useShortcut";
import { Shortcut } from "../ShortCut";

interface ButtonProps {
  label?: string | number;
  href?: string;
  className?: string;
  variant?: "fill" | "outline" | "ghost";
  // biome-ignore lint/suspicious/noExplicitAny: don't want to fight with react type hinting
  onClick?: (args?: any) => void;
  type?: "button" | "reset" | "submit";
  Icon?: ElementType;
  shortcut?: ShortcutDef;
  // shortcutBlockers?: boolean;
}
const Button = ({
  label,
  href,
  className = "",
  variant = "fill",
  type,
  onClick,
  Icon,
  shortcut,
  // shortcutBlockers,
}: ButtonProps) => {
  console.log(shortcut?.blockers);

  const router = useRouter();
  useShortcut(shortcut, () => {
    return href ? router.push(href) : onClick?.();
  });
  const style = "cursor-pointer rounded-3xl py-5 px-3.5 w-fit";

  const variantStyles = {
    fill: "bg-secondary/20 border-[1px] border-secondary",
    outline: "border-[1px] border-secondary",
    ghost: "!p-0 hover:text-primary active:text-darker",
  };

  const content = (Icon || label) && (
    <span className="flex justify-center items-center gap-3">
      {Icon && (
        <span>
          <Icon className="size-6" />
        </span>
      )}
      {label && (
        <span className="pe-1 font-semibold whitespace-nowrap">{label}</span>
      )}
      {shortcut && <Shortcut shortcut={shortcut} />}
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
