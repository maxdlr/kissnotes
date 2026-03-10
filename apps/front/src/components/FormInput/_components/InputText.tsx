import type { ChangeEvent, ElementType } from "react";
import type { ModName } from "@/components/ShortCut";

export interface InputTextProps {
  placeholder?: string;
  className?: string;
  value?: string;
  variant?: "fill" | "outline" | "ghost";
  onClick?: (e?: Event | React.MouseEvent) => void;
  Icon?: ElementType;
  shortcut?: (string | ElementType | ModName)[];
  name: string;
  label?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  type?: "text" | "search" | "email";
}

const InputText = ({
  type = "text",
  placeholder = "Search...",
  value,
  name,
  className,
  onClick,
  onChange,
  disabled,
}: InputTextProps) => {
  if (disabled && !value) {
    return <div className="h-px w-50 bg-accent/30 my-2" />;
  }
  return (
    <input
      type={type}
      name={name}
      placeholder={placeholder}
      className={`focus:ring-0 focus:outline-none whitespace-nowrap w-full ${className}`}
      value={value}
      onClick={onClick}
      onChange={onChange}
      disabled={disabled}
    />
  );
};
export default InputText;
