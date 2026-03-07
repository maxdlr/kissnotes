/** biome-ignore-all lint/a11y/noStaticElementInteractions: <explanation> */
"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import useOnClickOutside from "@/hooks/useClickOutside";
import { getNextZIndex } from "@/utils/zIndexManager";
import { ClientPortal } from "../ClientPortal";

interface ModalProps {
  className?: string;
  onClose?: (e?: Event | React.MouseEvent) => void;
  children: (
    onClose: (e?: Event | React.MouseEvent) => void,
  ) => React.ReactNode;
  closeOnOverlay?: boolean;
  isPersistent?: boolean;
  isFullWidth?: boolean;
  isFullHeight?: boolean;
  isCentered?: boolean;
}

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
  const [active, setActive] = useState(false);
  const nextZIndex = useMemo(() => getNextZIndex(), []);
  const minZIndex = nextZIndex > 50 ? nextZIndex : 50;

  const [zIndexOverlay] = useState(isPersistent ? 998 : minZIndex + 10);
  const [zIndexModal] = useState(isPersistent ? 999 : minZIndex + 60);

  const ref = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useOnClickOutside(ref, () => handleOnOverlayClick());

  useEffect(() => {
    timeoutIdRef.current = setTimeout(() => {
      const modals = document.querySelectorAll(".modal");
      if (modals.length) {
        document.body.style.cssText = "overflow:hidden";
        setActive(true);
      }
    }, 15);
    return () => {
      const modals = document.querySelectorAll(".modal");
      if (!modals.length) {
        document.body.style.cssText = "";
      }
    };
  }, []);

  const handleOnClose = useCallback(
    (e?: Event | React.MouseEvent) => {
      if (isPersistent) return;
      if (timeoutIdRef.current) clearTimeout(timeoutIdRef.current);
      setActive(false);
      setTimeout(() => {
        document.body.style.cssText = "";
        onClose?.(e);
      }, 200);
    },
    [onClose, isPersistent],
  );

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.keyCode === 27 && onClose) handleOnClose(event);
    };

    if (active) document.addEventListener("keydown", handleEscape, false);
    return () => {
      document.removeEventListener("keydown", handleEscape, false);
    };
  }, [active, onClose, handleOnClose]);

  const handleOnOverlayClick = () => {
    if (!closeOnOverlay) return;
    handleOnClose();
  };

  const getModalStyle = () => {
    const base = `transform transition-all duration-200 ${className} shadow-md w-full bg-modal ${
      active ? "opacity-100 scale-100" : "opacity-0 scale-95"
    } ${isFullHeight ? "" : " mb-8"}`;

    if (isFullWidth) {
      return `${base} ${
        active ? "sm:translate-y-0" : "sm:translate-y-20"
      } absolute bottom-0 top-0 sm:top-6 sm:rounded-t-6xl`;
    }

    if (isFullHeight) {
      return `${base} ${
        active ? "sm:translate-y-0" : "sm:translate-y-20"
      } absolute min-h-screen bottom-0 top-0`;
    }

    return `${base} ${
      active ? "sm:translate-y-0" : "sm:-translate-y-10"
    } delay-100 rounded-2xl sm:rounded-3xl`;
  };

  return (
    <ClientPortal selector="#modal">
      <div ref={modalRef} className="modal">
        <div
          role="presentation"
          data-testid="overlay"
          style={{ zIndex: zIndexOverlay }}
          className={`fixed transition-opacity duration-200 inset-0 bg-black/50 ${
            active ? "opacity-100" : "opacity-0"
          }`}
          onClick={handleOnOverlayClick}
        />
        <div
          style={{ zIndex: zIndexModal }}
          className={`modalInner flex items-start justify-center fixed inset-0 overflow-y-scroll scroll
             ${
               isFullWidth
                 ? ""
                 : `p-2 sm:px-5 sm:pt-8 ${isCentered ? "sm:items-center" : ""}`
             }`}
        >
          <div ref={ref} className={getModalStyle()}>
            {onClose && (
              <button
                type="button"
                className={`absolute hover:bg-gray-50 active:scale-95 rounded-lg z-10 p-4 sm:p-2 transition-opacity hover:opacity-100 opacity-80 duration-200 ${
                  isFullWidth
                    ? "top-0 right-0 sm:top-8 sm:right-8"
                    : "top-2.5 right-2.5"
                }`}
                aria-label="close"
                onClick={handleOnClose}
              >
                <svg
                  viewBox="0 0 12 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={isFullWidth ? "w-3 h-3 sm:w-5 sm:h-5" : "w-3 h-3"}
                >
                  <path
                    d="M0.395689 0.395689C-0.1901 0.981477 -0.117044 2.00428 0.55887 2.68019L3.57767 5.69899L0.55887 8.71779C-0.117033 9.39369 -0.1901 10.4165 0.395689 11.0023C0.981477 11.5881 2.00429 11.515 2.68019 10.8391L5.69899 7.82031L8.71779 10.8391C9.3937 11.515 10.4165 11.5881 11.0023 11.0023C11.5881 10.4165 11.515 9.3937 10.8391 8.71779L7.82031 5.69899L10.8391 2.68019C11.515 2.00429 11.5881 0.981477 11.0023 0.395689C10.4165 -0.1901 9.39369 -0.117033 8.71779 0.55887L5.69899 3.57767L2.68019 0.55887C2.00428 -0.117044 0.981477 -0.1901 0.395689 0.395689Z"
                    fill="#5D5D60"
                  />
                </svg>
              </button>
            )}

            <section>{children(handleOnClose)}</section>
          </div>
        </div>
      </div>
    </ClientPortal>
  );
};
export default Modal;
