import { type RefObject, useEffect } from "react";

const useOnClickOutside = <T extends HTMLElement>(
  ref: RefObject<T>,
  handler: (event: MouseEvent | TouchEvent) => void,
  portalClass = "",
): void => {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (portalClass) {
        const domEl = document.querySelector(portalClass);
        if (domEl?.contains(event.target as Node)) {
          return;
        }
      }
      if (!ref.current || ref.current.contains(event.target as Node)) {
        return;
      }
      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler, portalClass]);
};

export default useOnClickOutside;
