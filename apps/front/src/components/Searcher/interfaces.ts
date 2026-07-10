import { KissClickEvent } from "@/types/form.types";
import { ExpressionModel, Id } from "@kissnotes/types";
import { Dispatch, RefObject, SetStateAction } from "react";

export interface SearcherProps {
  onClose?: (e?: KissClickEvent) => void;
  placeholder?: string;
}

export type SearchResultModel = ExpressionModel & {
  native: boolean;
  score: number;
};

export interface SearcherResultProps {
  ref?: RefObject<HTMLDivElement | null>;
  expression: ExpressionModel;
  searchPrompt?: string;
  focused?: boolean;
  onClick?: () => void;
  native?: boolean;
}

export type SearcherContextType = {
  prompt: string;
  setPrompt: Dispatch<SetStateAction<string>>;
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  selectedIndex: { index: number; native: boolean; mouse: boolean };
  setSelectedIndex: Dispatch<
    SetStateAction<{ index: number; native: boolean; mouse: boolean }>
  >;
  previewing: { id?: Id; native: boolean } | undefined;
  setPreviewing: Dispatch<
    SetStateAction<{ id?: Id; native: boolean } | undefined>
  >;
};
