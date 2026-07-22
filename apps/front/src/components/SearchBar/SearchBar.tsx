"use client";

import FormInput from "@/components/FormInput";
import type { KissChangeEvent } from "@/types/form.types";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import useSearcher from "../Searcher/hooks/SearcherProvider";
import { SearchBarProps } from "./interfaces";

const SearchBar = ({
  placeholder = "Search...",
  inputClassName,
  className,
  variant = "outline",
  modalSearcher = false,
  shortcut,
  onChange,
  name = "search",
  Icon,
}: SearchBarProps) => {
  const { setIsOpen, prompt, setPrompt } = useSearcher();
  const ref = useRef<HTMLInputElement | null>(null);

  const handleOnChange = (e: KissChangeEvent) => {
    setPrompt(e.target.value);
    onChange?.(e);
  };

  return (
    <div className={className}>
      <FormInput
        ref={ref}
        name={name}
        inputClassName={`${inputClassName} ${modalSearcher ? "cursor-pointer" : ""}`}
        placeholder={placeholder}
        value={prompt}
        onChange={handleOnChange}
        variant={variant}
        onClick={modalSearcher ? () => setIsOpen(true) : undefined}
        Icon={Icon || MagnifyingGlassIcon}
        shortcut={
          modalSearcher && shortcut
            ? { ...shortcut, ignoreInputs: false }
            : undefined
        }
        containerClassName={`rounded-full @max-xs:border-0! @max-xs:px-0!`}
      />
    </div>
  );
};
export default SearchBar;
