"use client";

import { AnimatePresence } from "motion/react";
import { useCallback, useRef, useState } from "react";
import { QuestionMarkCircleIcon } from "@heroicons/react/24/solid";
import Bubble from "@/components/Bubble";
import type { TooltipProps, TooltipSize } from "./interfaces";

const PIN_SIZES: Record<TooltipSize, string> = {
  small: "size-4",
  normal: "size-6",
  large: "size-10",
  extraLarge: "size-14",
};

const Tooltip = ({
  content,
  position = "top",
  size = "normal",
  className = "",
  parentClassName = "",
  showDelay = 500,
  hideDelay = 100,
  Icon,
  children,
}: TooltipProps) => {
  const [visible, setVisible] = useState(false);
  const showTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>(null);

  const show = useCallback(() => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    showTimer.current = setTimeout(() => setVisible(true), showDelay);
  }, [showDelay]);

  const hide = useCallback(() => {
    if (showTimer.current) clearTimeout(showTimer.current);
    hideTimer.current = setTimeout(() => setVisible(false), hideDelay);
  }, [hideDelay]);

  const TriggerIcon = Icon ?? QuestionMarkCircleIcon;

  return (
    <span
      className={`relative inline-block ${parentClassName}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span
        className={`inline ${className}`}
        aria-describedby={visible ? "tooltip-bubble" : undefined}
      >
        {children ?? (
          <TriggerIcon className={`inline-block ${PIN_SIZES[size]}`} />
        )}
      </span>
      <AnimatePresence>
        {visible && content && <Bubble content={content} position={position} />}
      </AnimatePresence>
    </span>
  );
};

export default Tooltip;
