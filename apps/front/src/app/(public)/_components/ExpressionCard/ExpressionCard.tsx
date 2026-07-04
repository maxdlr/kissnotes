"use client";

import type { ExpressionModel } from "@kissnotes/types";
import { AnimatePresence, motion } from "motion/react";
import KissCodeBlock from "@/components/KissCodeBlock";
import Loading from "@/components/Loading";
import Pill from "@/components/Pill";
import UserHandle from "@/components/UserHandle";
import useExpressions from "@/hooks/useExpressions";
import { getRelativeTime } from "@/utils/dateUtils";
import { truncate } from "@/utils/stringUtils";

interface ExpressionCardProps {
  expression?: ExpressionModel & { native: boolean; score: number };
  className?: string;
  highlightedTokens: string[];
  onClick?: () => void;
}

const ExpressionCard = ({
  expression,
  className,
  highlightedTokens = [],
  onClick,
}: ExpressionCardProps) => {
  const { getTokens } = useExpressions(expression);

  return (
    <AnimatePresence initial={false} mode="wait">
      <motion.div
        onClick={onClick}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className={`block hover:bg-accent/10 border ${expression?.native ? "border-native" : "border-secondary"} hover:border-primary rounded-3xl! p-4! sm:p-8! cursor-pointer ${className}`}
      >
        {!expression ? (
          <Loading />
        ) : (
          <div className="grid grid-flow-row-dense gap-2 sm:gap-4">
            <div className="text-sm font-bold flex justify-between items-center text-accent">
              {expression.author?.username && (
                <UserHandle username={expression.author.username} />
              )}
              <p>{getRelativeTime(expression.createdAt)}</p>
            </div>
            <div className="text-lg font-bold">
              <p>{expression.title}</p>
            </div>
            {expression.description && (
              <div className="text-start">
                <p>{truncate(expression.description, 200)}</p>
              </div>
            )}
            <div className="flex overflow-auto justify-items-start items-center gap-2">
              {getTokens(["functions", "methods", "properties"]).map((t) => (
                <Pill label={t.label} key={t.index} />
              ))}
            </div>
            <KissCodeBlock
              highlightedTokens={highlightedTokens}
              expression={expression}
            />
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
export default ExpressionCard;
