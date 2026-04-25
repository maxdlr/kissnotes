"use client";
import type { ReactNode } from "react";

export interface ExpressionsLayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

const ExpressionsLayout = ({ modal, children }: ExpressionsLayoutProps) => {
  return (
    <>
      {modal}
      {children}
    </>
  );
};

export default ExpressionsLayout;
