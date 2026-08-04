"use client";
import ExpressionDetails from "@/components/ExpressionDetails";
import type { Id } from "@kissnotes/types";
import { useSearchParams } from "next/navigation";

const ExpressionById = ({ id }: { id: string }) => {
  const params = useSearchParams();
  const isNative = params.get("native");

  return (
    <article className="w-full md:w-11/12 lg:w-10/12 xl:w-8/12 2xl:w-7/12 mx-auto">
      <ExpressionDetails id={id as Id} native={isNative !== undefined} />
    </article>
  );
};

export default ExpressionById;
