"use client";
import useOnClickOutside from "@/hooks/useClickOutside";
import { type ShortcutDef, useShortcut } from "@/hooks/useShortcut";
import { KissChangeEvent } from "@/types/form.types";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import React, {
  type ElementType,
  type FocusEventHandler,
  useRef,
  useState,
} from "react";
import { Button } from "../Button";
import { Shortcut } from "../ShortCut";
import InputText from "./_components/InputText";
import InputToggle from "./_components/InputToggle";
import type { InputTextProps } from "./interfaces";

interface FormInputProps {
  placeholder?: string | React.ReactNode;
  inputClassName?: string;
  containerClassName?: string;
  className?: string;
  value?: string | number | boolean;
  variant?: "fill" | "outline" | "ghost";
  onClick?: (e?: Event | React.MouseEvent) => void;
  Icon?: ElementType;
  shortcut?: ShortcutDef;
  name: string;
  label?: string | React.ReactNode;
  onChange: (event: KissChangeEvent) => void;
  onFocus?: FocusEventHandler<HTMLInputElement>;
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
    | "hidden"
    | "password";
  labelIn?: boolean;
  ref?: React.RefObject<HTMLInputElement | null>;
}

const FormInput = ({
  type = "text",
  placeholder = "Search...",
  value,
  name,
  className,
  inputClassName,
  containerClassName,
  variant = "outline",
  onClick,
  Icon,
  shortcut,
  label,
  onChange,
  onFocus,
  disabled,
  labelIn = false,
  ref,
}: FormInputProps) => {
  const autoRef = useRef<HTMLInputElement | null>(null);
  const localRef = ref || autoRef;
  useOnClickOutside(localRef, () => {
    setFocus(false);
  });

  const [focus, setFocus] = useState(false);
  const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);

  useShortcut(
    shortcut,
    onClick && localRef ? onClick : () => localRef?.current?.focus(),
  );

  const variantStyles = {
    fill: "bg-secondary/20 border-[1px] border-secondary focus:bg-secondary/0 ",
    outline: "border-[1px] border-accent",
    ghost: "!p-0",
  };

  // biome-ignore lint/suspicious/noExplicitAny: dontcare
  const handleFocus: FocusEventHandler = (e: any): void => {
    setFocus(true);
    onFocus?.(e);
  };

  return (
    <div className={`w-full ${className}`}>
      {!labelIn && label && (
        <div className={`${disabled ? "" : "ps-2 pb-2"}`}>
          <label htmlFor={name} className="font-thin">
            {label}
          </label>
        </div>
      )}
      <div
        className={`${focus ? "border-secondary!" : "border-accent!"}
rounded-3xl py-3 px-4 flex 
${(label && labelIn) || Icon ? "justify-between" : "justify-start"} 
items-center gap-4 font-semibold text-lg w-full
${variantStyles[variant]} ${containerClassName}`}
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

        {["text", "search", "email", "password"].includes(type) && (
          <InputText
            ref={localRef}
            type={
              isPasswordRevealed && type === "password"
                ? "text"
                : (type as InputTextProps["type"])
            }
            name={name}
            placeholder={placeholder as InputTextProps["placeholder"]}
            className={`disabled:cursor-not-allowed focus:ring-0 focus:outline-none whitespace-nowrap ${inputClassName}`}
            value={value as InputTextProps["value"]}
            onClick={onClick}
            onChange={onChange}
            disabled={disabled}
            onFocus={handleFocus}
          />
        )}

        {type === "password" && (
          <Button
            size="sm"
            Icon={isPasswordRevealed ? EyeIcon : EyeSlashIcon}
            variant="ghost"
            onClick={() => setIsPasswordRevealed((r) => !r)}
            className={isPasswordRevealed ? "text-secondary!" : ""}
          />
        )}

        {shortcut && <Shortcut shortcut={shortcut} />}
      </div>
    </div>
  );
};
export default FormInput;
