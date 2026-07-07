"use client";
import ExpressionDetails from "@/components/ExpressionDetails";
import type { Id } from "@kissnotes/types";
import { useParams, useSearchParams } from "next/navigation";

const ExpressionByIdPage = () => {
  const { id } = useParams();
  const params = useSearchParams();
  const isNative = params.get("native");

  return (
    <article className="w-full md:w-11/12 lg:w-10/12 xl:w-8/12 2xl:w-7/12 mx-auto">
      <ExpressionDetails id={id as Id} native={isNative !== null} />
    </article>
  );
};

export default ExpressionByIdPage;
