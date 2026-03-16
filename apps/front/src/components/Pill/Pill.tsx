"use client";
import { useEffect, useId, useRef } from "react";
import { firaCode } from "@/app/fonts";
import useHover from "@/hooks/useHover";
import useSidebar from "../ExpressionListSidebar/hooks/useSidebar";

interface PillProps {
  label: string;
  className?: string;
  isCode?: boolean;
  useHovering?: boolean;
}

const Pill = ({
  label,
  className,
  isCode = true,
  useHovering = false,
}: PillProps) => {
  const ref = useRef<HTMLElement | null>(null);
  const isHovering = useHover(ref || null);
  const { setHovering } = useSidebar();

  useEffect(() => {
    if (!useHovering || !isHovering || !ref) {
      return;
    }
    setHovering(label);
  }, [isHovering, setHovering, useHovering, label]);

  return (
    <div
      id={useId()}
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`border border-accent bg-accent/20 rounded-full px-2 py-1 ${className}`}
    >
      <p className={`${isCode ? firaCode.className : ""} text-nowrap text-sm`}>
        {label}
      </p>
    </div>
  );
};

export default Pill;
