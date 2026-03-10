import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { ChangeEvent, type ElementType, useEffect, useState } from "react";
import { FormInput } from "../FormInput";
import { Searcher } from "../Searcher";
import type { ModName } from "../ShortCut";
import { ShortcutDef, useShortcut } from "@/hooks/useShortcut";

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
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState("");
  useShortcut(shortcut, () => setIsOpen(true));

  const handleOnChange = ({
    target: { value },
  }: ChangeEvent<HTMLInputElement>) => {
    setPrompt(value);
  };

  return (
    <div className={className}>
      <FormInput
        name="search"
        inputClassName={`${inputClassName} ${modalSearcher ? "cursor-pointer" : ""}`}
        placeholder={placeholder}
        value={prompt}
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
