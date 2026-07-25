import { Metadata } from "next";
import { ReactNode } from "react";
import ExpressionFormRedirect from "./_components/ExpressionFormRedirect";

interface ExpressionFormLayoutProps {
  children: ReactNode;
}

export const metadata: Metadata = {
  title: "Create or edit an expression",
};

const ExpressionFormLayout = ({ children }: ExpressionFormLayoutProps) => (
  <ExpressionFormRedirect>{children}</ExpressionFormRedirect>
);

export default ExpressionFormLayout;
