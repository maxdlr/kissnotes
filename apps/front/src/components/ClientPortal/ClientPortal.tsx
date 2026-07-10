import { useState } from "react";
import { createPortal } from "react-dom";

interface ClientPortalProps {
  children: React.ReactNode;
  selector: string;
}

const queryTarget = (selector: string): Element | null =>
  typeof document === "undefined" ? null : document.querySelector(selector);

const ClientPortal = ({ children, selector }: ClientPortalProps) => {
  const [target] = useState(() => queryTarget(selector));

  if (!target) return null;

  return createPortal(children, target);
};

export default ClientPortal;
