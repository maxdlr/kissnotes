"use client";
import type { Id } from "@kissnotes/types";
import { useParams } from "next/navigation";
import ExpressionDetails from "@/components/ExpressionDetails";

const ExpressionByIdPage = () => {
  const { id } = useParams();
  return (
    <article className="w-full md:w-11/12 lg:w-10/12 xl:w-8/12 2xl:w-7/12 mx-auto">
      <ExpressionDetails id={id as Id} />
    </article>
  );
};

export default ExpressionByIdPage;
