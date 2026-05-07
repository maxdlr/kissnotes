"use client";

import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ToastProps } from "./interfaces";
import {
  CheckBadgeIcon,
  InformationCircleIcon,
  XMarkIcon,
} from "@heroicons/react/24/solid";

export function Toast({
  id,
  Icon,
  title,
  message,
  type,
  duration = 3000,
  onDismiss,
}: ToastProps) {
  const [exiting, setExiting] = useState(false);
  const [started, setStarted] = useState(false);

  const onDismissRef = useRef(onDismiss);
  onDismissRef.current = onDismiss;

  const dismiss = useCallback(() => {
    setExiting(true);
  }, []);

  useEffect(() => {
    if (!exiting) return;
    const timer = setTimeout(() => onDismissRef.current(id), 150);
    return () => clearTimeout(timer);
  }, [exiting, id]);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setStarted(true);
    });
    const timer = setTimeout(dismiss, duration);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const variantType = {
    success: {
      Icon: Icon || CheckBadgeIcon,
      text: "text-emphasis",
      border: "border-emphasis",
      bg: "bg-emphasis",
    },
    error: {
      Icon: Icon || XMarkIcon,
      text: "text-danger",
      border: "border-danger",
      bg: "bg-danger",
    },
    info: {
      Icon: Icon || InformationCircleIcon,
      text: "text-primary",
      border: "border-primary",
      bg: "bg-primary",
    },
  }[type];

  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, translateY: 16 }}
      animate={{ opacity: 1, translateY: 0 }}
      exit={{ opacity: 0, translateY: -16 }}
    >
      <div
        className={`relative bg-darker border rounded-2xl p-3 lg:p-4 flex items-center gap-4 overflow-hidden ${variantType.border}`}
      >
        {Icon && (
          <span className="shrink-0 text-[20px]">
            {<variantType.Icon className={`size-6 ${variantType.text}`} />}
          </span>
        )}

        <div className="flex flex-col flex-1 min-w-0">
          {title && (
            <span className="leading-5 lg:text-[18px] lg:leading-6 font-extrabold text-white">
              {title}
            </span>
          )}
          <span className="text-[14px] leading-4.5 lg:leading-5 font-semibold text-white">
            {message}
          </span>
        </div>

        <div className="absolute bottom-0 left-1.75 right-1.75 h-0.75">
          <div
            className={`h-full rounded-full transition-all ease-linear ${variantType.bg}`}
            style={{
              width: started ? "0%" : "100%",
              transitionDuration: started ? `${duration}ms` : "0ms",
            }}
          />
        </div>
      </div>
    </motion.div>
  );
}
