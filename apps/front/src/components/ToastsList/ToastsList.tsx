"use client";

import { AnimatePresence } from "motion/react";
import useToasts from "@/contexts/ToastsContext";
import { Toast } from "./components/Toast";
import type { ToastsListProps } from "./interfaces";

export function ToastsList({ duration, className = "" }: ToastsListProps) {
  const { toasts, dismissToast } = useToasts();

  if (toasts.length === 0) return null;

  return (
    <div
      className={`fixed top-12 left-1/2 -translate-x-1/2 z-50 flex flex-col justify-end gap-3 w-95 ${className}`}
    >
      <AnimatePresence mode="sync">
        {toasts.map((t) => (
          <Toast
            {...t}
            key={t.id}
            duration={t.duration ?? duration}
            onDismiss={dismissToast}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}
