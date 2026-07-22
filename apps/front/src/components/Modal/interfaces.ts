import { KissClickEvent } from "@/types/form.types";
import { ReactNode, RefObject } from "react";

export interface ModalRenderProps {
  zIndexModal: number;
}

export interface ModalProps {
  className?: string;
  onClose?: (e?: KissClickEvent) => void;
  children: React.ReactNode | ((props: ModalRenderProps) => React.ReactNode);
  closeOnOverlay?: boolean;
  isPersistent?: boolean;
  isFullWidth?: boolean;
  isFullHeight?: boolean;
  isCentered?: boolean;
  HeaderChild?: ReactNode;
  ref?: RefObject<HTMLDivElement> | null;
}
