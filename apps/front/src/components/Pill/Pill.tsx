"use client";
import { firaCode } from "@/app/fonts";

interface PillProps {
  label: string;
  className?: string;
  isCode?: boolean;
}

const Pill = ({ label, className, isCode = true }: PillProps) => {
  return (
    <p
      className={`${isCode ? firaCode.className : ""} text-sm border border-accent bg-accent/20 rounded-full px-2 py-1 ${className}`}
    >
      {label}
    </p>
  );
};

export default Pill;
