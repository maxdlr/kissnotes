"use client";
import type { Id } from "@kissnotes/types";
import { useParams } from "next/navigation";
import { ExpressionDetails } from "@/components/ExpressionDetails";

const UserExpressionById = () => {
  const { id } = useParams();
  return (
    <article className="p-8">
      <ExpressionDetails id={id as Id} />
    </article>
  );
};

export default UserExpressionById;
