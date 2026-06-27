"use client";

import { Id } from "@kissnotes/types";
import { createContext, useContext, useState } from "react";

type SearcherContextType = {
  prompt: string;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedIndex: number;
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>;
  previewing: Id | undefined;
  setPreviewing: React.Dispatch<React.SetStateAction<Id | undefined>>;
};

const SearcherContext = createContext<SearcherContextType | null>(null);

export const SearcherProvider = ({
  children,
  startSearchPrompt,
}: {
  children: React.ReactNode;
  startSearchPrompt?: string;
}) => {
  const [prompt, setPrompt] = useState(startSearchPrompt || "");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [previewing, setPreviewing] = useState<Id | undefined>();

  return (
    <SearcherContext.Provider
      value={{
        prompt,
        setPrompt,
        isOpen,
        setIsOpen,
        selectedIndex,
        setSelectedIndex,
        previewing,
        setPreviewing,
      }}
    >
      {children}
    </SearcherContext.Provider>
  );
};

const useSearcher = () => {
  const context = useContext(SearcherContext);
  if (!context) {
    throw new Error("useSearcher must be used within a SearcherProvider");
  }
  return context;
};

export default useSearcher;
