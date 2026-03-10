"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import type { ChangeEvent } from "react";
import type { ShortcutDef } from "@/hooks/useShortcut";
import { FormInput } from "../FormInput";
import { Searcher } from "../Searcher";
import useSearcher from "../Searcher/hooks/useSearcher";

interface SearchBarProps {
  placeholder?: string;
  inputClassName?: string;
  className?: string;
  value?: string;
  variant?: "fill" | "outline" | "ghost";
  modalSearcher?: boolean;
  shortcut?: ShortcutDef;
}

const SearchBar = ({
  placeholder = "Search...",
  inputClassName,
  className,
  variant = "outline",
  modalSearcher = false,
  shortcut,
}: SearchBarProps) => {
  const { isOpen, setIsOpen, searchPrompt, setSearchPrompt } = useSearcher();

  const handleOnChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setSearchPrompt(value);
  };

  return (
    <div className={className}>
      <FormInput
        name="search"
        inputClassName={`${inputClassName} ${modalSearcher ? "cursor-pointer" : ""}`}
        placeholder={placeholder}
        value={searchPrompt}
        onChange={handleOnChange}
        variant={variant}
        onClick={modalSearcher ? () => setIsOpen(true) : undefined}
        Icon={MagnifyingGlassIcon}
        shortcut={modalSearcher ? shortcut : undefined}
      />
      {isOpen && modalSearcher && <Searcher onClose={() => setIsOpen(false)} />}
    </div>
  );
};
export default SearchBar;
