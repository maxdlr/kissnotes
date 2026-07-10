"use client";

import { Id } from "@kissnotes/types";
import { createContext, useContext, useState } from "react";
import { SearcherContextType } from "../interfaces";

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

  const [selectedIndex, setSelectedIndex] = useState<{
    index: number;
    native: boolean;
    mouse: boolean;
  }>({ index: 0, native: false, mouse: false });

  const [previewing, setPreviewing] = useState<
    { id?: Id; native: boolean } | undefined
  >();

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
