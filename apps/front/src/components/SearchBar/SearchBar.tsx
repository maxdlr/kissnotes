"use client";

import FormInput from "@/components/FormInput";
import Searcher from "@/components/Searcher";
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
  const { isOpen, setIsOpen, prompt, setPrompt } = useSearcher();
  const ref = useRef<HTMLInputElement | null>(null);

  const handleOnChange = (e: KissChangeEvent) => {
    setPrompt(e.target.value);
    onChange?.(e);
  };

  const handleClose = () => {
    setIsOpen(false);
    setPrompt("");
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
        containerClassName={`rounded-full`}
      />
      {isOpen && modalSearcher && <Searcher onClose={handleClose} />}
    </div>
  );
};
export default SearchBar;
