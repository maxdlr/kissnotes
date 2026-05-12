import type { ElementType } from "react";

export interface ToastData {
  id: string;
  key?: string;
  Icon?: ElementType;
  title?: string;
  message?: string;
  type: "info" | "success" | "error";
}

export interface ToastDataCreate extends Omit<ToastData, "id"> {}

export interface ToastsContextValue {
  toasts: ToastData[];
  addToast: (opts: ToastDataCreate) => void;
  dismissToast: (id: string) => void;
}
