import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { type ElementType, useState } from "react";
import { FormInput } from "../FormInput";
import { Searcher } from "../Searcher";
import type { ModName } from "../ShortCut";

interface SearchBarProps {
  placeholder?: string;
  inputClassName?: string;
  className?: string;
  value?: string;
  variant?: "fill" | "outline" | "ghost";
  modalSearcher?: boolean;
  shortcut?: (string | ElementType | ModName)[];
}

const SearchBar = ({
  placeholder = "Search...",
  value,
  inputClassName,
  className,
  variant = "outline",
  modalSearcher = false,
  shortcut,
}: SearchBarProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={className}>
      <FormInput
        name="search"
        inputClassName={`${inputClassName} ${modalSearcher ? "cursor-pointer" : ""}`}
        placeholder={placeholder}
        value={value}
        variant={variant}
        onClick={modalSearcher ? () => setIsOpen(true) : undefined}
        Icon={MagnifyingGlassIcon}
        shortcut={shortcut}
      />
      {isOpen && modalSearcher && <Searcher onClose={() => setIsOpen(false)} />}
    </div>
  );
};
export default SearchBar;
