"use client";
import type { ExpressionToken } from "@kissnotes/types";
import { firaCode } from "@/app/fonts";

interface TokenPillProps {
  token: ExpressionToken;
  className?: string;
}

const TokenPill = ({ token, className }: TokenPillProps) => {
  return (
    <p
      className={`${firaCode.className} text-sm border border-accent bg-accent/20 rounded-full px-2 py-1 ${className}`}
    >
      {token.label}
    </p>
  );
};

export default TokenPill;
