import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

interface ClientPortalProps {
  children: React.ReactNode;
  selector: string;
}

const ClientPortal = ({ children, selector }: ClientPortalProps) => {
  const ref = useRef<Element | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    ref.current = document.querySelector(selector);
    setIsMounted(true);
  }, [selector]);

  if (typeof document === "undefined" || !document.querySelector(selector)) {
    return;
  }

  return isMounted && ref.current ? createPortal(children, ref.current) : null;
};

export default ClientPortal;
