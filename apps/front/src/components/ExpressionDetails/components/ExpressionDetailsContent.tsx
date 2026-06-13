import Button from "@/components/Button";
import KissCodeBlock from "@/components/KissCodeBlock";
import LayerMockup from "@/components/LayerMockup";
import Pill from "@/components/Pill";
import UserHandle from "@/components/UserHandle";
import useExpressions from "@/hooks/useExpressions";
import {
  EyeIcon,
  QuestionMarkCircleIcon,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { ExpressionModel } from "@kissnotes/types";
import { useState } from "react";

export interface ExpressionDetailsContentProps {
  expression: ExpressionModel;
}

const ExpressionDetailsContent = ({
  expression,
}: ExpressionDetailsContentProps) => {
  const { tokens } = useExpressions(expression || []);

  // const tokens = getTokens(["variables"]);
  const [highlightedTokens, setHighlightedTokens] = useState<string[]>([]);

  const handleHighlightToken = (token: string) => {
    if (highlightedTokens.includes(token)) {
      setHighlightedTokens((prev) => prev.filter((t) => t !== token));
      return;
    }
    if (token) {
      setHighlightedTokens((prev) => [...prev, token]);
    }
  };

  console.log({ expression });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 md:gap-8">
      {(!!expression.author?.username ||
        !!expression.views ||
        !!expression.shares) && (
        <div className="flex justify-start items-center gap-4 col-span-1 md:col-span-full">
          {expression.author && (
            <UserHandle username={expression.author.username} />
          )}
          {(!!expression.views || !!expression.shares) && (
            <span className="text-secondary">•</span>
          )}
          {!!expression.views && (
            <Button variant="ghost" Icon={EyeIcon} label={expression.views} />
          )}
          {!!expression.shares && (
            <Button
              variant="ghost"
              Icon={ShareIcon}
              label={expression.shares}
            />
          )}
        </div>
      )}

      {expression.title && (
        <h1 className="text-2xl font-bold col-span-1 md:col-span-full">
          {expression.title}
        </h1>
      )}

      <LayerMockup
        layer={expression.layer}
        property={expression.property}
        className={`col-span-full ${expression.symbols ? "md:col-span-1" : ""}`}
      />

      {expression.symbols && (
        <div className="space-y-2 colspan-full md:col-span-1">
          <div className="flex flex-wrap justify-start items-center gap-2">
            <div className="flex gap-2">
              <h3 className="text-lg font-semibold text-accent">Tokens</h3>
              <Button variant="ghost" Icon={QuestionMarkCircleIcon} size="sm" />
            </div>
            {!!tokens.length && <span className="text-secondary px-2">•</span>}
            {tokens.map((t) => (
              <Button
                key={t.id}
                variant="ghost"
                label={
                  <Pill
                    label={t.title}
                    className={`hover:text-white hover:border-emphasis/80 ${highlightedTokens.includes(t.label) ? "border-emphasis text-emphasis" : ""}`}
                  />
                }
                className={`text-secondary! ${
                  highlightedTokens.includes(t.label) ? "bg-accent" : ""
                }`}
                onClick={() => handleHighlightToken(t.label)}
              />
            ))}
          </div>
        </div>
      )}

      <KissCodeBlock
        enableCopy
        enableLineCopy
        expression={expression}
        highlightedTokens={highlightedTokens}
        className="col-span-1 md:col-span-full"
      />

      {expression.description && (
        <div className="space-y-2 col-span-full">
          <h3 className="text-lg font-semibold text-accent">Description</h3>
          <p>{expression.description}</p>
        </div>
      )}
    </div>
  );
};
export default ExpressionDetailsContent;
