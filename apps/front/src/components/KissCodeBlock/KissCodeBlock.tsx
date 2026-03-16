"use client";

import { ClipboardIcon } from "@heroicons/react/24/outline";
import type { ExpressionModel } from "@kissnotes/types";
import { type ReactElement, useEffect, useState } from "react";
import { CodeBlock } from "react-code-block";
import { Button } from "../Button";
import KissLineContent from "./components/KissLineContent";

interface CodeBlockProps {
  expression: ExpressionModel;
  className?: string;
  highlightedTokens: string[];
}
const KissCodeBlock = ({
  expression,
  className,
  highlightedTokens,
}: CodeBlockProps) => {
  const { code, property } = expression;
  const [tokens, setTokens] = useState<string[]>(highlightedTokens || []);
  const text = code.lines.map((l) => l.content).join("\n");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const lineMatches: string[] = [];

  const tokenHighlightedCode: ReactElement = (
    <CodeBlock.Code>
      <KissLineContent>
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
      <KissLineContent>
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
      setIsLoading(false);
      return;
    }

    if (highlightedTokens?.length) {
      setTokens(highlightedTokens);
      setCodeBlock(tokenHighlightedCode);
      setIsLoading(false);
      return;
    }

    setIsLoading(false);
  }, [highlightedTokens]);

  if (isLoading) return "loading";

  return (
    <CodeBlock code={text} language="js" words={tokens} lines={lineMatches}>
      <div className="relative bg-code p-8 pt-20 rounded-2xl overflow-hidden">
        <div className="absolute top-8 left-8 text-sm text-accent">
          {`${property.group}.${property.name}`}
        </div>
        <Button
          className="absolute top-8 right-8"
          Icon={ClipboardIcon}
          shortcut={{ keys: ["cmd", "shift", "C"] }}
          variant="ghost"
        />
        <div className={`relative overflow-scroll ${className}`}>
          {codeBlock}
        </div>
      </div>
    </CodeBlock>
  );
};

export default KissCodeBlock;
