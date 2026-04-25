"use client";
import { QuestionMarkCircleIcon } from "@heroicons/react/16/solid";
import { EyeIcon, ShareIcon, XMarkIcon } from "@heroicons/react/24/outline";
import type { ExpressionModel, Id } from "@kissnotes/types";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import Button from "@/components/Button/Button";
import { KissCodeBlock } from "@/components/KissCodeBlock";
import { LayerMockup } from "@/components/LayerMockup";
import { Modal } from "@/components/Modal";
import Pill from "@/components/Pill/Pill";
import { UserHandle } from "@/components/UserHandle";
import useRead from "@/hooks/bread/useRead";
import useExpressions from "@/hooks/useExpressions";

const ExpressionDetails = () => {
  const { id } = useParams();
  const router = useRouter();
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

  return (
    <Modal onClose={() => router.push("/exp")} className="lg:w-3/4 xl:w-2/3 2xl:w-1/2">
      {expression && (
        <article
          className="
      grid grid-cols-1 md:grid-cols-2
      w-full mx-auto
      gap-4 md:gap-8 
      p-8 
      bg-dark 
      rounded-4xl 
      border"
        >
          <div className="flex justify-between items-center col-span-1 md:col-span-full">
            <UserHandle username={expression.author.username} />
            <div className="flex justify-between items-center gap-6">
              <Button variant="ghost" Icon={EyeIcon} label={14} />
              <Button variant="ghost" Icon={ShareIcon} label={6} />
              <span className="text-secondary">•</span>
              <Button
                shortcut={{ keys: ["ESC"] }}
                variant="ghost"
                Icon={XMarkIcon}
                href="/exp"
              />
            </div>
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
                <Button
                  variant="ghost"
                  Icon={QuestionMarkCircleIcon}
                  size="sm"
                />
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
            expression={expression}
            highlightedTokens={highlightedTokens}
            className="col-span-1 md:col-span-full"
          />

          <div className="space-y-2 col-span-full">
            <h3 className="text-lg font-semibold text-accent">Description</h3>
            <p>{expression.description}</p>
          </div>
        </article>
      )}
    </Modal>
  );
};

export default ExpressionDetails;
