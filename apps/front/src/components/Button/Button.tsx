import Link from "next/link";
import type { ElementType } from "react";
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
  shortcut?: (string | ElementType)[];
}
const Button = ({
  label,
  href,
  className,
  variant = "fill",
  type,
  onClick,
  Icon,
  shortcut,
}: ButtonProps) => {
  const style =
    "cursor-pointer flex justify-center items-center rounded-3xl p-3.5 gap-3 w-fit";

  const variantStyles = {
    fill: "bg-secondary/20 border-2 border-secondary",
    outline: "border-2 border-secondary",
    ghost: "!p-0 hover:text-primary active:text-darker",
  };

  const content = (
    <span className={`${style} ${variantStyles[variant]} ${className}`}>
      {Icon && (
        <span>
          <Icon className="size-6" />
        </span>
      )}
      {label && <span className="pe-1">{label}</span>}
      {shortcut && <Shortcut keys={shortcut} />}
    </span>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return (
    <button type={type} onClick={onClick}>
      {content}
    </button>
  );
};

export default Button;
