"use client";
import type { Id } from "@kissnotes/types";
import { useParams } from "next/navigation";
import { ExpressionDetails } from "@/components/ExpressionDetails";

export interface ExpressionDetailsProps {
  onClose: () => void;
}

const ExpressionById = () => {
  const { id } = useParams();
  return (
    <article className="p-8">
      <ExpressionDetails id={id as Id} />
    </article>
  );
};

export default ExpressionById;
