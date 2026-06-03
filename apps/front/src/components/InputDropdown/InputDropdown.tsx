import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { type } from "os";
import { Ref } from "react";
import Button from "../Button";
import InputText from "../FormInput/_components/InputText";
import InputTextArea from "../FormInput/_components/InputTextArea";
import InputToggle from "../FormInput/_components/InputToggle";
import { InputTextProps } from "../FormInput/interfaces";
import Shortcut from "../ShortCut";
import { FormDropdownProps } from "./interfaces";

const InputDropdown = <T,>({
  label,
  name,
  placeholder,
  className,
  property,
  options,
  value,
  onChange,
  required,
  disabled,
}: FormDropdownProps<T>) => {
  if (!property) {
    console.error("Dropdown needs property");
    return null;
  }
  return (
    <select
      className={`appearance-none bg-transparent border-none outline-none ${className ?? ""}`}
      name={name}
      disabled={disabled}
      required={required}
    >
      {options?.map((option, index) => (
        <option key={index} value={option[property] as string}>
          {option[property] as string}
        </option>
      ))}
    </select>
  );
};
export default InputDropdown;
