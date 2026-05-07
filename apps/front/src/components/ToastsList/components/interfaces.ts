import type { ElementType } from "react";

export interface ToastProps {
  /** Unique identifier for the toast. */
  id: string;
  /** Optional icon to display in the toast. */
  Icon?: ElementType;
  /** Optional title for the toast. */
  title?: string;
  /** Main message/content of the toast. */
  message: string;
  /** Optional duration (in milliseconds) for which the toast is displayed before dismissal. */
  duration?: number;
  /**
   * Callback function triggered when the toast is dismissed.
   * @param id - The id of the dismissed toast.
   */
  onDismiss: (id: string) => void;
  /** Type of the toast, which can be used for styling purposes (e.g., "success", "error", "info"). */
  type: "success" | "error" | "info";
}
