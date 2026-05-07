"use client";

import { createContext, useCallback, useContext, useState } from "react";
import type { ToastsProviderProps } from "@/components/ToastsList";
import type {
  ToastData,
  ToastDataCreate,
  ToastsContextValue,
} from "./interfaces";

const MAX_TOASTS = 5;
const ToastsContext = createContext<ToastsContextValue | null>(null);

export const ToastsProvider = ({ children }: ToastsProviderProps) => {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback((opts: ToastDataCreate) => {
    const dedupeKey = opts.key ?? `${opts.title ?? ""}:${opts.message}`;
    queueMicrotask(() => {
      setToasts((prev) => {
        if (prev.some((t) => t.key === dedupeKey)) return prev;
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
        const next = [...prev, { id, key: dedupeKey, ...opts }];
        return next.slice(-MAX_TOASTS);
      });
    });
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastsContext value={{ toasts, addToast, dismissToast }}>
      {children}
    </ToastsContext>
  );
};

const useToasts = () => {
  const ctx = useContext(ToastsContext);
  if (!ctx) throw new Error("useToasts must be used within a ToastsProvider");
  return ctx;
};

export default useToasts;
