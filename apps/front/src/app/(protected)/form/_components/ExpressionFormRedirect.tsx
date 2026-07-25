"use client";
import { useParams, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

interface ExpressionFormRedirectProps {
  children: ReactNode;
}

const ExpressionFormRedirect = ({ children }: ExpressionFormRedirectProps) => {
  const { id } = useParams();
  const router = useRouter();

  useEffect(() => {
    if (!id) {
      router.replace("/form/new");
    }
  }, [id, router]);

  return children;
};

export default ExpressionFormRedirect;
