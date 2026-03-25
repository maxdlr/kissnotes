"use client";
import type { ExpressionModel, UserModel } from "@kissnotes/types";
import { useEffect, useState } from "react";
import { ExpressionCard } from "@/components/ExpressionCard";
import { ExpressionListSidebar } from "@/components/ExpressionListSidebar";
import type { SidebarValue } from "@/components/ExpressionListSidebar/ExpressionListSidebar";
import useBrowse from "@/hooks/bread/useBrowse";

const Expressions = () => {
  const [expressions, setExpressions] = useState<ExpressionModel[]>([]);
  const [filters, setFilters] = useState<SidebarValue>({
    author: null,
    tokens: [],
    search: "",
  });

  const { data, loading } = useBrowse<ExpressionModel[]>("expressions", {
    author: { id: filters?.author?.id as number } as UserModel,
    symbols: filters?.tokens
      ? { tokens: [...filters.tokens.map((t) => t.title)] }
      : null,
    search: filters?.search,
  });

  useEffect(() => {
    if (loading) {
      return;
    }
    setExpressions(data || []);
  }, [data, loading]);

  const handleFilter = (updatedFilters: SidebarValue) => {
    setFilters(updatedFilters);
  };

  return (
    <div className="grid grid-cols-7 grid-flow-row gap-4 md:gap-8">
      <ExpressionListSidebar
        expressions={expressions || []}
        className="col-span-full lg:col-span-2"
        value={filters}
        onChange={handleFilter}
      />
      <div className="col-span-full lg:col-span-5 grid grid-flow-row xl:grid-cols-2 gap-2 md:gap-4">
        {expressions?.map((expression) => (
          <ExpressionCard
            highlightedTokens={[]}
            key={expression.id}
            expression={expression}
          />
        ))}
      </div>
    </div>
  );
};

export default Expressions;
