import { ListExpression } from "@/app/(public)/_components/ExpressionList/interfaces";

export interface CodeBlockProps {
  expression: ListExpression;
  className?: string;
  highlightedTokens?: string[];
  highlightedLines?: number | number[];
  enableCopy?: boolean;
  enableLineCopy?: boolean;
  condensed?: boolean;
}

export type HighlightMode = "tokens" | "lines" | "none";

export interface KissLineContentProps {
  children: React.ReactNode;
  lineContentClassName?: string;
  lineNumberClassName?: string;
  className?: string;
  interactive?: boolean;
  condensed?: boolean;
}
