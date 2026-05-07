import type { ReactNode } from 'react';

export interface ToastsProviderProps {
  children: ReactNode;
}

export interface ToastsListProps {
  /** Toast display duration */
  duration?: number;
  /** Additional CSS classes for the toasts list container */
  className?: string;
}
