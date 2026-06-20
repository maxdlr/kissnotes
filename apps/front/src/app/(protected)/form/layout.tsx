"use client";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ExpressionFormLayoutProps {
  children: ReactNode;
}
const ExpressionFormLayout = ({ children }: ExpressionFormLayoutProps) => {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id) {
      router.replace("/form/new");
    }
  });

  return children;
};
export default ExpressionFormLayout;
