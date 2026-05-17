"use client";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { type FocusEventHandler, type Ref, useRef, useState } from "react";
import Button from "@/components/Button";
import Shortcut from "@/components/ShortCut";
import useOnClickOutside from "@/hooks/useClickOutside";
import { useShortcut } from "@/hooks/useShortcut";
import InputText from "./_components/InputText";
import InputTextArea from "./_components/InputTextArea";
import InputToggle from "./_components/InputToggle";
import type { FormInputProps, InputTextProps } from "./interfaces";

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
  required = false,
  errors,
}: FormInputProps) => {
  const autoRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null);
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
    ghost: `!p-0 ${label && ["text", "search", "email", "password"].includes(type) ? "border border-transparent! py-3! px-4!" : ""}`,
  };

  // biome-ignore lint/suspicious/noExplicitAny: dontcare
  const handleFocus: FocusEventHandler = (e: any): void => {
    setFocus(true);
    onFocus?.(e);
  };

  return (
    <div className={`w-full relative ${className}`}>
      {!labelIn && label && (
        <label htmlFor={name} className="absolute -translate-y-1/2 w-full">
          <span className="mx-6 text-sm flex justify-between items-center gap-2 leading-none">
            <span className="flex text-accent px-2 bg-darker justify-start items-center gap-2">
              <span>•</span>
              {label}
              <span>•</span>
            </span>
            {required && (
              <span
                className={`${value ? "text-emphasis" : !disabled ? "text-danger" : "text-accent/40"} translate-y-[30%] px-1 bg-darker`}
              >
                *
              </span>
            )}
          </span>
        </label>
      )}
      <div
        className={`${focus ? "border-secondary" : errors?.length ? "border-danger" : "border-accent"}
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
            ref={localRef as Ref<HTMLInputElement>}
            type={
              isPasswordRevealed && type === "password"
                ? "text"
                : (type as InputTextProps["type"])
            }
            name={name}
            placeholder={placeholder as InputTextProps["placeholder"]}
            className={`disabled:cursor-not-allowed focus:ring-0 focus:outline-none whitespace-nowrap ${inputClassName}`}
            value={value as InputTextProps["value"]}
            onChange={onChange}
            onClick={onClick}
            disabled={disabled}
            onFocus={handleFocus}
          />
        )}

        {type === "textarea" && (
          <InputTextArea
            ref={localRef as Ref<HTMLTextAreaElement>}
            placeholder={placeholder as InputTextProps["placeholder"]}
            name={name}
            onChange={onChange}
            onClick={onClick}
            disabled={disabled}
            onFocus={handleFocus}
            value={value as InputTextProps["value"]}
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
      {errors?.map((e) => (
        <p key={e} className="text-sm ps-8 text-danger mt-1">
          {e}
        </p>
      ))}
    </div>
  );
};
export default FormInput;
