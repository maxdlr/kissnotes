import type { ChangeEvent, ElementType } from "react";
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
  label?: string;
  onChange: (event: ChangeEvent) => void;
  disabled?: boolean;
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
  label,
  onChange,
  disabled,
}: FormInputProps) => {
  const style = "font-semibold text-lg";

  const variantStyles = {
    fill: "bg-secondary/20 border-[1px] border-secondary focus:bg-secondary/0 ",
    outline: "border-[1px] border-secondary",
    ghost: "!p-0",
  };

  return (
    <div className={className}>
      <label htmlFor={name}>{label}</label>
      <div
        className={`rounded-3xl p-4 flex justify-center items-center gap-4 ${style} ${variantStyles[variant]} `}
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
          onChange={onChange}
          disabled={disabled}
        />
        {shortcut && <Shortcut keys={shortcut} />}
      </div>
    </div>
  );
};
export default FormInput;
