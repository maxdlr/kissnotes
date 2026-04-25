"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRef } from "react";
import type { ShortcutDef } from "@/hooks/useShortcut";
import type { FormChangeEvent } from "@/types/form.types";
import { FormInput } from "../FormInput";
import { Searcher } from "../Searcher";
import useSearcher from "../Searcher/hooks/useSearcher";

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
  onChange?: (e: FormChangeEvent) => void;
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
  const { isOpen, setIsOpen, searchPrompt, setSearchPrompt } = useSearcher();
  const ref = useRef<HTMLInputElement | null>(null);

  const handleOnChange = (e: FormChangeEvent) => {
    setSearchPrompt(e.target.value);
    onChange?.(e);
  };

  return (
    <div className={className}>
      <FormInput
        ref={ref}
        name={name}
        inputClassName={`${inputClassName} ${modalSearcher ? "cursor-pointer" : ""}`}
        placeholder={placeholder}
        value={searchPrompt}
        onChange={handleOnChange}
        variant={variant}
        onClick={modalSearcher ? () => setIsOpen(true) : undefined}
        Icon={Icon || MagnifyingGlassIcon}
        shortcut={modalSearcher ? shortcut : undefined}
        containerClassName={`rounded-full`}
      />
      {isOpen && modalSearcher && <Searcher onClose={() => setIsOpen(false)} />}
    </div>
  );
};
export default SearchBar;
