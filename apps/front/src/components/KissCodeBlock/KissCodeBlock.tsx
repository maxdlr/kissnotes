"use client";

import { ClipboardIcon as ClipboardIconOutline } from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import type { ExpressionModel } from "@kissnotes/types";
import { useMemo, useState } from "react";
import { CodeBlock } from "react-code-block";
import Button from "@/components/Button";
import KissLineContent from "./components/KissLineContent";

interface CodeBlockProps {
  expression: ExpressionModel;
  className?: string;
  highlightedTokens?: string[];
  highlightedLines?: number | number[];
  enableCopy?: boolean;
  enableLineCopy?: boolean;
  condensed?: boolean;
}

type HighlightMode = "tokens" | "lines" | "none";

const KissCodeBlock = ({
  expression,
  className = "",
  highlightedTokens = [],
  highlightedLines,
  enableCopy = false,
  enableLineCopy = false,
  condensed = false,
}: CodeBlockProps) => {
  const { code, property } = expression;
  const text = code?.lines.map((l) => l.content).join("\n") || "";
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  const lines = useMemo(
    () =>
      highlightedLines == null
        ? []
        : Array.isArray(highlightedLines)
          ? highlightedLines
          : [highlightedLines],
    [highlightedLines],
  );

  const mode: HighlightMode = useMemo(() => {
    if (highlightedTokens.length > 0) return "tokens";
    if (lines.length > 0) return "lines";
    return "none";
  }, [highlightedTokens, lines]);

  return (
    <CodeBlock
      code={text}
      language="js"
      words={mode === "tokens" ? highlightedTokens : []}
      lines={mode === "lines" ? lines : []}
    >
      <div
        className={`relative bg-code rounded-2xl overflow-hidden ${condensed ? "py-2 px-4" : "p-8"} space-y-8 ${className}`}
      >
        {!condensed && (
          <div className="sticky w-full">
            <div
              className={`flex ${property ? "justify-between" : "justify-end"} items-start`}
            >
              {property && (
                <p className="text-sm text-accent leading-tight">
                  {`${property?.group || ""}${property?.name ? `.${property.name}` : ""}`}
                </p>
              )}
              {enableCopy && (
                <Button
                  Icon={copied ? CheckBadgeIcon : ClipboardIconOutline}
                  size="sm"
                  shortcut={{ keys: ["cmd", "C"] }}
                  variant="ghost"
                  onClick={handleCopy}
                />
              )}
            </div>
          </div>
        )}
        <div className="overflow-x-auto w-full relative">
          <CodeBlock.Code>
            {({ isLineHighlighted }) => (
              <KissLineContent
                condensed={condensed}
                interactive={enableLineCopy}
                className={
                  mode === "lines"
                    ? isLineHighlighted
                      ? "bg-accent/30 rounded-2xl"
                      : "opacity-90"
                    : ""
                }
                lineNumberClassName={
                  mode === "lines"
                    ? isLineHighlighted
                      ? "text-gray-300"
                      : "text-gray-500"
                    : ""
                }
              >
                <CodeBlock.Token>
                  {({ isTokenHighlighted, children }) => (
                    <span
                      className={
                        mode === "tokens" && isTokenHighlighted
                          ? "bg-emphasis/20 text-emphasis rounded-md px-1 py-0.5"
                          : ""
                      }
                    >
                      {children}
                    </span>
                  )}
                </CodeBlock.Token>
              </KissLineContent>
            )}
          </CodeBlock.Code>
        </div>
      </div>
    </CodeBlock>
  );
};

export default KissCodeBlock;
