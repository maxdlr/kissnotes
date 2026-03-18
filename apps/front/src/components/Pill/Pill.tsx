"use client";
import { firaCode } from "@/app/fonts";

interface PillProps {
  label: string;
  className?: string;
  isCode?: boolean;
  useHovering?: boolean;
}

const Pill = ({ label, className, isCode = true }: PillProps) => {
  return (
    <div
      className={`border border-accent bg-accent/20 rounded-full px-2 py-1 ${className}`}
    >
      <p className={`${isCode ? firaCode.className : ""} text-nowrap text-sm`}>
        {label}
      </p>
    </div>
  );
};

export default Pill;
