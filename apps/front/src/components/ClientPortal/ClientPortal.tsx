"use client";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface ClientPortalProps {
  children: React.ReactNode;
  selector: string;
}

const ClientPortal = ({ children, selector }: ClientPortalProps) => {
  const [target, setTarget] = useState<Element | null>(null);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTarget(document.querySelector(selector));
  }, [selector]);

  if (!target) return null;

  return createPortal(children, target);
};

export default ClientPortal;
