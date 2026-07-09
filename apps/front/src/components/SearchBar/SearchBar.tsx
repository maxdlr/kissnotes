"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import type { ShortcutDef } from "@/hooks/useShortcut";
import type { KissChangeEvent } from "@/types/form.types";
import FormInput from "@/components/FormInput";
import Searcher from "@/components/Searcher";
import useSearcher from "../Searcher/hooks/SearcherProvider";

interface SearchBarProps {
  placeholder?: string;
  inputClassName?: string;
  className?: string;
  value?: string;
  name?: string;
  variant?: "fill" | "outline" | "ghost";
  modalSearcher?: boolean;
  shortcut?: ShortcutDef;
  Icon?: React.ElementType | null;
  onChange?: (e: KissChangeEvent) => void;
}

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
