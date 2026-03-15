import type { ChangeEvent, ElementType } from "react";
import { type ModName, Shortcut } from "../ShortCut";
import InputText, { type InputTextProps } from "./_components/InputText";
import InputToggle from "./_components/InputToggle";
import { ShortcutDef, useShortcut } from "@/hooks/useShortcut";

interface FormInputProps {
  placeholder?: string;
  inputClassName?: string;
  className?: string;
  value?: string | number | boolean;
  variant?: "fill" | "outline" | "ghost";
  onClick?: (e?: Event | React.MouseEvent) => void;
  Icon?: ElementType;
  shortcut?: ShortcutDef;
  name: string;
  label?: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  type?:
    | "text"
    | "number"
    | "search"
    | "button"
    | "checkbox"
    | "color"
    | "date"
    | "email"
    | "file"
    | "hidden";
  labelIn?: boolean;
}

const FormInput = ({
  type = "text",
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
  labelIn = false,
}: FormInputProps) => {
  useShortcut(shortcut, onClick as (e: KeyboardEvent) => void);
  const variantStyles = {
    fill: "bg-secondary/20 border-[1px] border-secondary focus:bg-secondary/0 ",
    outline: "border-[1px] border-secondary",
    ghost: "!p-0",
  };

  return (
    <div className={className}>
      {!labelIn && (
        <div className="pb-2 ps-2">
          <label htmlFor={name} className="font-thin">
            {label}
          </label>
        </div>
      )}
      <div
        className={`rounded-3xl py-3 px-4 flex ${(label && labelIn) || Icon ? "justify-between" : "justify-start"} items-center gap-4 font-semibold text-lg ${variantStyles[variant]} `}
      >
        {((label && labelIn) || Icon) && (
          <div>
            {Icon && (
              <span>
                <Icon className="size-6" />
              </span>
            )}

            {labelIn && <label htmlFor={name}>{label}</label>}
          </div>
        )}

        {type === "checkbox" && (
          <InputToggle
            value={value as boolean}
            onChange={onChange}
            name={name}
            disabled={disabled}
          />
        )}

        {["text", "search", "email"].includes(type) && (
          <InputText
            type={type as InputTextProps["type"]}
            name={name}
            placeholder={placeholder}
            className={`disabled:cursor-not-allowed focus:ring-0 focus:outline-none whitespace-nowrap w-full ${inputClassName}`}
            value={value as InputTextProps["value"]}
            onClick={onClick}
            onChange={onChange}
            disabled={disabled}
          />
        )}
        {shortcut && <Shortcut shortcut={shortcut} />}
      </div>
    </div>
  );
};
export default FormInput;
