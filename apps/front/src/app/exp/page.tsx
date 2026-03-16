"use client";
import type { ExpressionModel, UserModel } from "@kissnotes/types";
import { useState } from "react";
import { ExpressionCard } from "@/components/ExpressionCard";
import ExpressionListSidebar, {
  type SidebarValue,
} from "@/components/ExpressionListSidebar/ExpressionListSidebar";
import useBrowse from "../../hooks/bread/useBrowse";
import useSidebar from "@/components/ExpressionListSidebar/hooks/useSidebar";

const Expressions = () => {
  const { hovering } = useSidebar();
  const [filters, setFilters] = useState<SidebarValue>({
    author: null,
    tokens: [],
  });

  const { data: expressions, mutate } = useBrowse<ExpressionModel[]>(
    "expressions",
    {
      author: { id: filters?.author?.id as number } as UserModel,
    },
  );

  const handleFilter = (updatedFilters: SidebarValue) => {
    setFilters(updatedFilters);
    mutate(); // data will reactively update once mutate resolves
  };

  return (
    <div className="grid grid-cols-6 grid-flow-row gap-4 md:gap-8">
      <ExpressionListSidebar
        expressions={expressions || []}
        className="col-span-full lg:col-span-2"
        value={filters}
        onChange={handleFilter}
      />
      <div className="col-span-full lg:col-span-4 grid grid-flow-row xl:grid-cols-2 gap-2 md:gap-4">
        {expressions?.map((expression) => (
          <ExpressionCard
            highlightedTokens={[hovering]}
            key={expression.id}
            expression={expression}
          />
        ))}
      </div>
    </div>
  );
};

export default Expressions;
