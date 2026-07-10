"use client";
import Button from "@/components/Button";
import Shortcut from "@/components/ShortCut";
import useFocus from "@/hooks/bread/useFocus";
import { useShortcut } from "@/hooks/useShortcut";
import { KissChangeEvent } from "@/types/form.types";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { motion } from "motion/react";
import { useState, type FocusEventHandler, type Ref } from "react";
import Collapsible from "../Collapsible";
import InputCode from "./_components/InputCode";
import InputDropdown from "./_components/InputDropdown";
import InputText from "./_components/InputText";
import InputTextArea from "./_components/InputTextArea";
import InputToggle from "./_components/InputToggle";
import type { FormInputProps, InputTextProps } from "./interfaces";

const FormInput = <T = "string",>({
  autoFocus = false,
  type = "text",
  codeHeight = "200px",
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
  const { ref: localRef, focus, unfocus, isFocused } = useFocus(ref);
  const [isPasswordRevealed, setIsPasswordRevealed] = useState(false);
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [tapped, setTapped] = useState(false);

  useShortcut(shortcut, onClick && localRef ? onClick : () => focus());

  const variantStyles = {
    fill: "bg-secondary/20 border-[1px] border-secondary focus:bg-secondary/0 ",
    outline: `border-[1px] border-accent ${
      isFocused
        ? "border-secondary"
        : errors?.length
          ? "border-danger"
          : `border-accent hover:border-secondary/50`
    } ${hovered ? "bg-accent/50" : ""} ${tapped ? "bg-accent/100" : ""} transition-colors cursor-pointer`,
    ghost: `!p-0 ${label && ["text", "search", "email", "password"].includes(type) ? "border border-transparent! py-3! px-4!" : ""}`,
  };

  const handleInputFocus: FocusEventHandler<HTMLInputElement> = (e): void => {
    focus();
    onFocus?.(e);
  };

  const handleTextAreaFocus: FocusEventHandler<HTMLTextAreaElement> = (
    e,
  ): void => {
    focus();
    onFocus?.(e);
  };

  const handleChange = (e: KissChangeEvent | KissChangeEvent<T>) => {
    onChange?.(e);
    setOpen(false);
    if (type === "dropdown") {
      unfocus();
    }
  };

  return (
    <div className={`w-full relative ${className}`}>
      {!labelIn && label && (
        <label htmlFor={name} className="absolute -translate-y-1/2 w-full">
          <span className="mx-6 text-sm flex justify-between items-center gap-2 leading-none">
            <span
              className={`flex text-accent px-2 ${labelBg} justify-start items-center gap-2 text-nowrap`}
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

      <motion.div
        animate={
          open
            ? {
                borderBottomLeftRadius: "0.5rem",
                borderBottomRightRadius: "0.5rem",
                borderTopLeftRadius: "1.5rem",
                borderTopRightRadius: "1.5rem",
              }
            : {
                borderBottomLeftRadius: "1.5rem",
                borderBottomRightRadius: "1.5rem",
                borderTopLeftRadius: "1.5rem",
                borderTopRightRadius: "1.5rem",
              }
        }
        className={`
p-5 flex
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
            onChange={handleChange}
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
            autoFocus={autoFocus}
            placeholder={placeholder as InputTextProps["placeholder"]}
            className={`disabled:cursor-not-allowed ${inputClassName}`}
            value={value as InputTextProps["value"]}
            onChange={handleChange}
            onClick={onClick}
            disabled={disabled}
            onFocus={handleInputFocus}
          />
        )}

        {type === "textarea" && (
          <InputTextArea
            autoFocus={autoFocus}
            className={inputClassName}
            ref={localRef as Ref<HTMLTextAreaElement>}
            placeholder={placeholder as InputTextProps["placeholder"]}
            name={name}
            onChange={handleChange}
            onClick={onClick}
            disabled={disabled}
            onFocus={handleTextAreaFocus}
            value={value as string}
            rows={rows}
          />
        )}

        {type === "dropdown" && (
          <InputDropdown
            ref={localRef as React.RefObject<HTMLDivElement | null>}
            name={name}
            open={open}
            label={label}
            onChange={handleChange}
            onClose={() => setOpen(false)}
            onOpen={() => {
              focus();
              setOpen(true);
            }}
            onHover={(h) => setHovered(h)}
            onTap={(t) => setTapped(t)}
            disabled={disabled}
            options={options}
            value={value as T}
            property={property}
          />
        )}

        {type === "code" && (
          <InputCode
            value={value as string}
            height={codeHeight}
            onChange={handleChange}
            onFocus={focus}
            onUnfocus={unfocus}
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

        {EndChild}

        {shortcut && <Shortcut shortcut={shortcut} />}
      </motion.div>
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
