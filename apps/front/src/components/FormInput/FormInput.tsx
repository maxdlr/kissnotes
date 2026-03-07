import type { ElementType } from "react";
import { type ModName, Shortcut } from "../ShortCut";

interface FormInputProps {
  placeholder?: string;
  inputClassName?: string;
  className?: string;
  value?: string;
  variant?: "fill" | "outline" | "ghost";
  onClick?: (e?: Event | React.MouseEvent) => void;
  Icon?: ElementType;
  shortcut?: (string | ElementType | ModName)[];
  name: string;
}

const FormInput = ({
  placeholder = "Search...",
  value,
  name,
  className,
  inputClassName,
  variant = "outline",
  onClick,
  Icon,
  shortcut,
}: FormInputProps) => {
  const variantStyles = {
    fill: "bg-secondary/20 border-[1px] border-secondary focus:bg-secondary/0 ",
    outline: "border-[1px] border-secondary",
    ghost: "!p-0 hover:text-primary active:text-darker",
  };

  return (
    <div
      className={`rounded-3xl p-4 flex justify-center items-center gap-4 ${variantStyles[variant]} ${className}`}
    >
      {Icon && (
        <span>
          <Icon className="size-6" />
        </span>
      )}
      <input
        name={name}
        placeholder={placeholder}
        className={`focus:ring-0 focus:outline-none whitespace-nowrap w-full ${inputClassName}`}
        value={value}
        onClick={onClick}
      />
      {shortcut && <Shortcut keys={shortcut} />}
    </div>
  );
};
export default FormInput;
