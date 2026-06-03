"use client";
import Button from "@/components/Button";
import Shortcut from "@/components/ShortCut";
import useFocus from "@/hooks/bread/useFocus";
import { useShortcut } from "@/hooks/useShortcut";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import { type FocusEventHandler, type Ref, useState } from "react";
import Collapsible from "../Collapsible";
import InputDropdown from "../InputDropdown/InputDropdown";
import InputText from "./_components/InputText";
import InputTextArea from "./_components/InputTextArea";
import InputToggle from "./_components/InputToggle";
import type { FormInputProps, InputTextProps } from "./interfaces";

const FormInput = <T = "string",>({
  type = "text",
  options = [],
  placeholder = "Search...",
  value,
  property,
  rows,
  name,
  className = "",
  inputClassName = "",
  containerClassName = "",
  variant = "outline",
  onClick,
  Icon,
  shortcut,
  label,
  onChange,
  onFocus,
  disabled,
  labelIn = false,
  labelBg = "bg-darker",
  ref,
  required = false,
  errors,
  EndChild,
  StartChild,
}: FormInputProps<T>) => {
  const { ref: localRef, focus, isFocused } = useFocus(ref);
  const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
  useShortcut(shortcut, onClick && localRef ? onClick : () => focus());

  const variantStyles = {
    fill: "bg-secondary/20 border-[1px] border-secondary focus:bg-secondary/0 ",
    outline: "border-[1px] border-accent",
    ghost: `!p-0 ${label && ["text", "search", "email", "password"].includes(type) ? "border border-transparent! py-3! px-4!" : ""}`,
  };

  // biome-ignore lint/suspicious/noExplicitAny: dontcare
  const handleFocus: FocusEventHandler = (e: any): void => {
    focus();
    onFocus?.(e);
  };

  return (
    <div className={`w-full relative ${className}`}>
      {!labelIn && label && (
        <label htmlFor={name} className="absolute -translate-y-1/2 w-full">
          <span className="mx-6 text-sm flex justify-between items-center gap-2 leading-none">
            <span
              className={`flex text-accent px-2 ${labelBg} justify-start items-center gap-2`}
            >
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
        className={`${isFocused ? "border-secondary" : errors?.length ? "border-danger" : "border-accent hover:border-secondary/50 cursor-pointer"}
rounded-3xl py-3 px-4 flex 
${(label && labelIn) || Icon ? "justify-between" : "justify-start"} 
items-center gap-4 font-semibold text-lg w-full
${variantStyles[variant]} ${containerClassName}`}
      >
        {StartChild}
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
            className={inputClassName}
            ref={localRef as Ref<HTMLTextAreaElement>}
            placeholder={placeholder as InputTextProps["placeholder"]}
            name={name}
            onChange={onChange}
            onClick={onClick}
            disabled={disabled}
            onFocus={handleFocus}
            value={value as InputTextProps["value"]}
            rows={rows}
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
        {type === "dropdown" && (
          <InputDropdown
            label={label}
            placeholder={placeholder}
            onChange={onChange}
            disabled={disabled}
            options={options}
            value={value as InputTextProps["value"]}
            property={property}
          />
        )}
        {EndChild}
        {shortcut && <Shortcut shortcut={shortcut} />}
      </div>
      <Collapsible collapsed={!errors?.length}>
        <ul className="list-disc list-inside">
          {errors?.map((e) => (
            <motion.li
              initial={{ y: -10 }}
              animate={{ y: 0 }}
              exit={{ y: -10 }}
              key={e}
              className="text-sm ps-8 text-danger mt-1"
            >
              {e}
            </motion.li>
          ))}
        </ul>
      </Collapsible>
    </div>
  );
};
export default FormInput;
