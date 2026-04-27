"use client";

import { ClipboardIcon as ClipboardIconOutline } from "@heroicons/react/24/outline";
import { CheckBadgeIcon } from "@heroicons/react/24/solid";
import type { ExpressionModel } from "@kissnotes/types";
import { type ReactElement, useEffect, useState } from "react";
import { CodeBlock } from "react-code-block";
import Button from "../Button";
import Loading from "../Loading";
import KissLineContent from "./components/KissLineContent";

interface CodeBlockProps {
  expression: ExpressionModel;
  className?: string;
  highlightedTokens: string[];
  enableCopy?: boolean;
  enableLineCopy?: boolean;
}
const KissCodeBlock = ({
  expression,
  className,
  highlightedTokens,
  enableCopy = false,
  enableLineCopy = false,
}: CodeBlockProps) => {
  const { code, property } = expression;
  const [tokens, setTokens] = useState<string[]>(highlightedTokens || []);
  const text = code.lines.map((l) => l.content).join("\n");
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    setCopied((v) => !v);
    setTimeout(() => setCopied((v) => !v), 1000);
  };

  const lineMatches: string[] = [];

  const tokenHighlightedCode: ReactElement = (
    <CodeBlock.Code>
      <KissLineContent interactive={enableLineCopy}>
        <CodeBlock.Token>
          {({ isTokenHighlighted, children }) => (
            <span
              className={
                isTokenHighlighted
                  ? "bg-emphasis/20 text-emphasis rounded-md px-1 py-0.5"
                  : ""
              }
            >
              {children}
            </span>
          )}
        </CodeBlock.Token>
      </KissLineContent>
    </CodeBlock.Code>
  );

  const lineHighlightedCode: ReactElement = (
    <CodeBlock.Code>
      {({ isLineHighlighted }) => (
        <KissLineContent
          interactive={enableLineCopy}
          className={isLineHighlighted ? "bg-violet-500/30" : "opacity-60"}
          lineNumberClassName={
            isLineHighlighted ? "text-gray-300" : "text-gray-500"
          }
        >
          <CodeBlock.Token />
        </KissLineContent>
      )}
    </CodeBlock.Code>
  );

  const normalCode: ReactElement = (
    <CodeBlock.Code>
      <KissLineContent interactive={enableLineCopy}>
        <CodeBlock.Token />
      </KissLineContent>
    </CodeBlock.Code>
  );

  const [codeBlock, setCodeBlock] = useState<ReactElement | undefined>(
    normalCode,
  );

  useEffect(() => {
    if (!highlightedTokens?.length) {
      setCodeBlock(normalCode);
      setLoading(false);
      return;
    }

    if (highlightedTokens?.length) {
      setTokens(highlightedTokens);
      setCodeBlock(tokenHighlightedCode);
      setLoading(false);
      return;
    }

    setLoading(false);
  }, [highlightedTokens]);

  if (loading) return <Loading />;

  return (
    <CodeBlock code={text} language="js" words={tokens} lines={lineMatches}>
      <div
        className={`relative bg-code rounded-2xl overflow-hidden p-8 space-y-8 ${className}`}
      >
        <div className="sticky w-full">
          <div className="flex justify-between items-start">
            <p className="text-sm text-accent leading-tight">
              {`${property.group}.${property.name}`}
            </p>
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
        <div className="overflow-x-auto w-full relative">{codeBlock}</div>
      </div>
    </CodeBlock>
  );
};

export default KissCodeBlock;
