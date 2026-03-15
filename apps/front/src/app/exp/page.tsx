"use client";
import type { ExpressionModel } from "@kissnotes/types";
import { ExpressionCard } from "@/components/ExpressionCard";
import ExpressionListSidebar from "@/components/ExpressionListSidebar/ExpressionListSidebar";
import useBrowse from "../../hooks/bread/useBrowse";

const Expressions = () => {
  const { data: expressions } = useBrowse<ExpressionModel[]>("expressions");
  if (!expressions) return <div>Loading...</div>;
  return (
    <div className="grid grid-cols-6 grid-flow-row gap-4 md:gap-8">
      <ExpressionListSidebar
        expressions={expressions}
        className="col-span-full lg:col-span-2"
      />
      <div className="col-span-full lg:col-span-4 grid grid-flow-row xl:grid-cols-2 gap-2 md:gap-4">
        {expressions?.map((expression) => (
          <ExpressionCard key={expression.id} expression={expression} />
        ))}
      </div>
    </div>
  );
};
export default Expressions;
