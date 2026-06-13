import { KissChangeEvent } from "@/types/form.types";
import { getNextZIndex } from "@/utils/zIndexManager";
import { useState } from "react";
import { motion } from "motion/react";
import Collapsible from "@/components/Collapsible";
import { FormDropdownProps } from "../interfaces";

const InputDropdown = <T,>({
  ref,
  open = false,
  label,
  name,
  placeholder,
  className,
  property,
  options,
  value,
  onChange,
  onOpen,
  required,
  disabled,
  onHover,
  onTap,
  onClose,
}: FormDropdownProps<T>) => {
  const [zIndex, setZIndex] = useState(0);

  if (!property) {
    console.error("Dropdown needs property");
    return null;
  }

  const handleChange = (option: T) => {
    onChange?.({ target: { name, value: option } } as KissChangeEvent<T>);
  };

  const handleMainButton = () => {
    setZIndex(getNextZIndex());
    open ? onClose?.() : onOpen?.();
  };

  return (
    <div className="w-full">
      {(label || value) && (
        <>
          <motion.button
            onClick={handleMainButton}
            type="button"
            onHoverStart={() => onHover?.(true)}
            onHoverEnd={() => onHover?.(false)}
            onTapStart={() => onTap?.(true)}
            onTap={() => onTap?.(false)}
            className="cursor-pointer text-start w-full"
          >
            {value?.[property] != null ? String(value[property]) : label}
          </motion.button>
        </>
      )}
      <div className="absolute left-0 top-full w-full pt-4" style={{ zIndex }}>
        <Collapsible collapsed={!open}>
          <div
            className={`bg-darker/90 border ${open ? "border-secondary" : "border-accent "} overflow-hidden`}
            style={{
              borderTopLeftRadius: ".5rem",
              borderTopRightRadius: ".5rem",
              borderBottomLeftRadius: "1.5rem",
              borderBottomRightRadius: "1.5rem",
            }}
          >
            <div className="flex flex-col gap-1">
              {options?.map((option) => (
                <motion.button
                  key={JSON.stringify(option[property])}
                  onClick={() => handleChange(option)}
                  className="cursor-pointer py-2 px-4 rounded font-normal hover:bg-accent/50 hover:text-primary active:bg-accent/70 text-left"
                >
                  {typeof option[property] === "string"
                    ? (option[property] as string)
                    : JSON.stringify(option[property])}
                </motion.button>
              ))}
            </div>
          </div>
        </Collapsible>
      </div>
    </div>
  );
};
export default InputDropdown;
