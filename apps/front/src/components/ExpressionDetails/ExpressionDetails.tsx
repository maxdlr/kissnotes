"use client";
import { QuestionMarkCircleIcon } from "@heroicons/react/16/solid";
import { EyeIcon, ShareIcon } from "@heroicons/react/24/outline";
import type { ExpressionModel, Id } from "@kissnotes/types";
import { useState } from "react";
import Button from "@/components/Button/Button";
import { KissCodeBlock } from "@/components/KissCodeBlock";
import { LayerMockup } from "@/components/LayerMockup";
import Pill from "@/components/Pill/Pill";
import { UserHandle } from "@/components/UserHandle";
import useRead from "@/hooks/bread/useRead";
import useExpressions from "@/hooks/useExpressions";

export interface ExpressionDetailsProps {
  id: Id;
}

const ExpressionDetails = ({ id }: ExpressionDetailsProps) => {
  const { data: expression } = useRead<ExpressionModel>("expressions", {
    id: id as Id,
  });
  const { getTokens } = useExpressions(expression || []);
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

  return expression ? (
    <div className="grid grid-cols-1 md:grid-cols-2 w-full gap-4 md:gap-8">
      <div className="flex justify-start items-center gap-4 col-span-1 md:col-span-full">
        <UserHandle username={expression.author.username} />
        <span className="text-secondary">•</span>
        <Button variant="ghost" Icon={EyeIcon} label={14} />
        <Button variant="ghost" Icon={ShareIcon} label={6} />
      </div>

      <h1 className="text-2xl font-bold col-span-1 md:col-span-full">
        {expression.title}
      </h1>

      <LayerMockup
        layer={expression.layer}
        property={expression.property}
        className="col-span-full md:col-span-1"
      />

      <div className="space-y-2 colspan-full md:col-span-1">
        <div className="flex flex-wrap justify-start items-center gap-2">
          <div className="flex gap-2">
            <h3 className="text-lg font-semibold text-accent">Tokens</h3>
            <Button variant="ghost" Icon={QuestionMarkCircleIcon} size="sm" />
          </div>
          <span className="text-secondary px-2">•</span>
          {getTokens(["variables"]).map((t) => (
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

      <KissCodeBlock
        enableCopy
        enableLineCopy
        expression={expression}
        highlightedTokens={highlightedTokens}
        className="col-span-1 md:col-span-full"
      />

      <div className="space-y-2 col-span-full">
        <h3 className="text-lg font-semibold text-accent">Description</h3>
        <p>{expression.description}</p>
      </div>
    </div>
  ) : (
    "loading"
  );
};

export default ExpressionDetails;
