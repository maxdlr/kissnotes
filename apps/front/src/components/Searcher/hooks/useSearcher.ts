"use client";

import { useState } from "react";

const useSearcher = () => {
  const [searchPrompt, setSearchPrompt] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  return {
    searchPrompt,
    setSearchPrompt,
    isOpen,
    setIsOpen,
  };
};
export default useSearcher;
