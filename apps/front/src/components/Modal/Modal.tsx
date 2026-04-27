/** biome-ignore-all lint/a11y/noStaticElementInteractions: dont care */
/** biome-ignore-all lint/a11y/useKeyWithClickEvents: dont care */
"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { AnimatePresence, motion } from "motion/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { KissClickEvent } from "@/types/form.types";
import { getNextZIndex } from "@/utils/zIndexManager";
import Button from "../Button";
import ClientPortal from "../ClientPortal";

type ModalProps = {
  className?: string;
  onClose?: (e?: KissClickEvent) => void;
  children: React.ReactNode;
  closeOnOverlay?: boolean;
  isPersistent?: boolean;
  isFullWidth?: boolean;
  isFullHeight?: boolean;
  isCentered?: boolean;
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const Modal = ({
  className = "",
  onClose,
  children,
  closeOnOverlay = true,
  isPersistent = false,
  isFullWidth = false,
  isFullHeight = false,
  isCentered = false,
}: ModalProps) => {
  const [isOpen, setIsOpen] = useState(true);

  const nextZIndex = useMemo(() => getNextZIndex(), []);
  const minZIndex = nextZIndex > 50 ? nextZIndex : 50;
  const zIndexOverlay = isPersistent ? 998 : minZIndex + 10;
  const zIndexModal = isPersistent ? 999 : minZIndex + 60;

  useEffect(() => {
    document.body.style.cssText = "overflow:hidden";
    return () => {
      const modals = document.querySelectorAll(".modal");
      if (!modals.length) {
        document.body.style.cssText = "";
      }
    };
  }, []);

  const handleClose = useCallback(
    (e?: KissClickEvent) => {
      console.log("close");
      e?.stopPropagation();
      if (isPersistent) return;
      setIsOpen(false);
      onClose?.(e);
    },
    [isPersistent, onClose],
  );

  const handleExitComplete = useCallback(() => {
    if (!document) return;
    document.body.style.cssText = "";
    console.log("complete");
  }, []);

  const handleOverlayClick = useCallback(
    (e: React.MouseEvent) => {
      console.log("overlay close");
      if (!closeOnOverlay) return;
      if (e.target === e.currentTarget) handleClose();
    },
    [closeOnOverlay, handleClose],
  );

  const contentRef = useRef<HTMLDivElement>(null);

  const modalVariants = {
    hidden: { opacity: 0, y: 200 },
    visible: { opacity: 1, y: 0 },
  };

  const layoutClass = (() => {
    const base = `relative shadow-md w-full ${isFullHeight ? "" : "mb-8"} ${className}`;
    if (isFullWidth) {
      return `${base} absolute bottom-0 top-0 sm:top-6 sm:rounded-t-6xl`;
    }
    if (isFullHeight) {
      return `${base} absolute min-h-screen bottom-0 top-0`;
    }
    return `${base} rounded-2xl sm:rounded-3xl`;
  })();

  return (
    <ClientPortal selector="#modal">
      <div className="modal">
        <AnimatePresence onExitComplete={handleExitComplete}>
          {isOpen && (
            <>
              <motion.div
                role="presentation"
                data-testid="overlay"
                style={{ zIndex: zIndexOverlay }}
                className="fixed inset-0 bg-black/50"
                variants={overlayVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
              />
              <div
                style={{ zIndex: zIndexModal }}
                className={`modalInner flex items-start justify-center fixed inset-0 overflow-y-scroll scroll ${
                  isFullWidth
                    ? ""
                    : `p-2 sm:px-5 sm:pt-8 ${isCentered ? "sm:items-center" : ""}`
                }`}
                onClick={handleOverlayClick}
              >
                <motion.div
                  className={layoutClass}
                  variants={modalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  {onClose && (
                    <Button
                      shortcut={{ keys: ["ESC"] }}
                      variant="ghost"
                      Icon={XMarkIcon}
                      onClick={handleClose}
                      className={`absolute z-10 sm:top-8 sm:right-8 ${
                        isFullWidth ? "top-0 right-0" : "top-2.5 right-2.5"
                      }`}
                      aria-label="close"
                    />
                  )}
                  <section ref={contentRef}>{children}</section>
                </motion.div>
              </div>
            </>
          )}
        </AnimatePresence>
      </div>
    </ClientPortal>
  );
};

export default Modal;
