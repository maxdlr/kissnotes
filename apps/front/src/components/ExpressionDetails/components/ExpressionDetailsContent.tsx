import Button from "@/components/Button";
import KissCodeBlock from "@/components/KissCodeBlock";
import LayerMockup from "@/components/LayerMockup";
import Pill from "@/components/Pill";
import Tooltip from "@/components/Tooltip";
import UserHandle from "@/components/UserHandle";
import useExpressions from "@/hooks/useExpressions";
import {
  EyeIcon,
  BookmarkIcon as OutlineBookmark,
  ShareIcon,
} from "@heroicons/react/24/outline";
import { BookmarkIcon as SolidBookmark } from "@heroicons/react/24/solid";
import {
  ExpressionModel,
  ExpressionToken,
  Id,
  UserModel,
} from "@kissnotes/types";
import { useState } from "react";

export interface ExpressionDetailsContentProps {
  expression: ExpressionModel;
  onSave?: () => void;
  user?: UserModel;
}

const ExpressionDetailsContent = ({
  expression,
  onSave,
  user,
}: ExpressionDetailsContentProps) => {
  const { getTokens } = useExpressions(expression || []);

  const tokens = getTokens(["properties", "methods", "functions"]);
  const [highlightedTokens, setHighlightedTokens] = useState<string[]>([]);
  const [hoveredToken, setHoveredToken] = useState<ExpressionToken>();

  const handleHighlightToken = (token: string) => {
    if (highlightedTokens.includes(token)) {
      setHighlightedTokens((prev) => prev.filter((t) => t !== token));
    } else {
      setHighlightedTokens((prev) => [...prev, token]);
    }
  };

  const handleHoverStart = (token: ExpressionToken) => {
    setHoveredToken(token);
  };

  const handleHoverEnd = () => {
    setHoveredToken(undefined);
  };

  console.log({ views: expression.views });
  console.log(user?.saves);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 md:gap-8">
      {(!!expression.author?.username ||
        !!expression.views ||
        !!expression.shares) && (
        <div className="flex justify-start items-center gap-4 col-span-1 md:col-span-full">
          {expression.author && (
            <UserHandle username={expression.author.username} />
          )}
          <span className="text-secondary">•</span>
          <Button variant="ghost" Icon={EyeIcon} label={expression.views} />
          <Button variant="ghost" Icon={ShareIcon} label={expression.shares} />
          <Button
            variant="ghost"
            Icon={
              !user
                ? OutlineBookmark
                : (user.saves as Id[]).includes(expression.id) //TODO: saveId vs expressionId
                  ? SolidBookmark
                  : OutlineBookmark
            }
            label={String(expression.saves)}
            onClick={onSave}
          />
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
              <Tooltip content="Tokens" />
            </div>
            {!!tokens.length && <span className="text-secondary px-2">•</span>}
            {tokens.map((t) => (
              <Button
                onHoverStart={() => handleHoverStart(t)}
                onHoverEnd={handleHoverEnd}
                tooltip={{ content: t.description || "", showDelay: 500 }}
                key={t.id}
                variant="ghost"
                label={
                  <Pill
                    label={t.label}
                    className={`hover:text-white hover:border-emphasis/80 ${highlightedTokens.includes(t.title) ? "border-emphasis text-emphasis" : ""}`}
                  />
                }
                className={`text-secondary! ${
                  highlightedTokens.includes(t.title) ? "bg-accent" : ""
                }`}
                onClick={() => handleHighlightToken(t.title)}
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
        highlightedLines={hoveredToken?.line}
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
