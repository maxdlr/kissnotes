"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useRef, useState, type ChangeEvent } from "react";
import type { ShortcutDef } from "@/hooks/useShortcut";
import { FormInput } from "../FormInput";
import { Searcher } from "../Searcher";
import useSearcher from "../Searcher/hooks/useSearcher";
import useOnClickOutside from "@/hooks/useClickOutside";

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
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
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
  const [focus, setFocus] = useState(false);
  const ref = useRef<HTMLInputElement | null>(null);
  useOnClickOutside(ref, () => {
    setFocus(false);
  });

  const handleOnChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setSearchPrompt(value);
    onChange({ target: { name, value } } as ChangeEvent<HTMLInputElement>);
  };

  const handleFocus = () => {
    setFocus(true);
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
        onFocus={handleFocus}
        variant={variant}
        onClick={modalSearcher ? () => setIsOpen(true) : undefined}
        Icon={Icon === null ? undefined : Icon || MagnifyingGlassIcon}
        shortcut={modalSearcher ? shortcut : undefined}
        containerClassName={`${focus ? "border-secondary!" : "border-accent!"} rounded-full`}
      />
      {isOpen && modalSearcher && <Searcher onClose={() => setIsOpen(false)} />}
    </div>
  );
};
export default SearchBar;
