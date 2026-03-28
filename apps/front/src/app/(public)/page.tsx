"use client";
import type { ExpressionModel, UserModel } from "@kissnotes/types";
import { useEffect, useState } from "react";
import { ExpressionList } from "@/components/ExpressionList";
import type { SidebarValue } from "@/components/ExpressionListSidebar/ExpressionListSidebar";
import useBrowse from "@/hooks/bread/useBrowse";

const Home = () => {
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

  return (
    expressions && (
      <ExpressionList
        expressions={expressions}
        filters={filters}
        onFilterChange={setFilters}
      />
    )
  );
};

export default Home;
