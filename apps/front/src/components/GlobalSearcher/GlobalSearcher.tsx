"use client";

import Searcher from "@/components/Searcher";
import useSearcher from "@/components/Searcher/hooks/SearcherProvider";

/**
 * Single, app-wide mount point for the search modal. `SearchBar` and `MobileMenu`
 * both toggle the shared `isOpen` state but must not render their own `<Searcher>` —
 * doing so would mount two modals stacked on top of each other, since both components
 * are always present in the tree (only hidden via CSS on their respective breakpoints).
 */
const GlobalSearcher = () => {
  const { isOpen, setIsOpen, setPrompt } = useSearcher();

  const handleClose = () => {
    setIsOpen(false);
    setPrompt("");
  };

  if (!isOpen) return null;

  return <Searcher onClose={handleClose} />;
};

export default GlobalSearcher;
