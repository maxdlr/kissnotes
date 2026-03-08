"use client";

import { ClipboardIcon } from "@heroicons/react/24/outline";
import type { ExpressionModel } from "@kissnotes/types";
import { type ReactElement, useEffect, useState } from "react";
import { CodeBlock } from "react-code-block";
import { Button } from "../Button";
import KissLineContent from "./components/KissLineContent";
import useAeExpressions from "./hooks/useAeExpressions";

interface CodeBlockProps {
  expression: ExpressionModel;
  className: string;
}
const KissCodeBlock = ({ expression, className }: CodeBlockProps) => {
  const { code, property } = expression;
  const { text, matches, isLoading: isParsing } = useAeExpressions(code, []);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const lineMatches: string[] = [];

  const wordHighlightedCode: ReactElement = (
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
    setCodeBlock(() => {
      if (!!matches.length && !!lineMatches.length) {
        return normalCode;
      }

      if (!!matches.length && !lineMatches.length) {
        return wordHighlightedCode;
      } else if (!!lineMatches.length && !matches.length) {
        return lineHighlightedCode;
      }
      return normalCode;
    });
    setIsLoading(false);
  }, [matches, wordHighlightedCode, lineHighlightedCode]);

  if (isLoading || isParsing) return "loading";

  return (
    <CodeBlock code={text} language="js" words={matches} lines={lineMatches}>
      <div className="relative bg-code p-8 pt-24 rounded-2xl">
        <div className="absolute top-8 left-8 text-sm text-accent">
          {`${property.group}.${property.name}`}
        </div>
        <Button
          className="absolute top-8 right-8"
          Icon={ClipboardIcon}
          shortcut={["cmd", "shift", "C"]}
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
