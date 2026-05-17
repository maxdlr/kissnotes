"use client";
import type {
  ExpressionModel,
  ExpressionSymbol,
  UserModel,
} from "@kissnotes/types";
import { useEffect, useState } from "react";
import ExpressionList from "@/app/(public)/_components/ExpressionList";
import type { SidebarValue } from "@/app/(public)/_components/ExpressionListSidebar/ExpressionListSidebar";
import Hero from "@/components/Hero";
import Loading from "@/components/Loading";
import useBrowse from "@/hooks/bread/useBrowse";

const ExpressionListPage = () => {
  const [expressions, setExpressions] = useState<ExpressionModel[]>([]);
  const [filters, setFilters] = useState<SidebarValue>({
    author: null,
    tokens: [],
    search: "",
  });

  const { data, loading } = useBrowse<ExpressionModel[]>("expressions", {
    author: { id: filters?.author?.id as number } as UserModel,
    symbols: {
      tokens: [...(filters?.tokens || []).map((t) => t.title)],
    } as ExpressionSymbol,
    search: filters?.search,
  });

  useEffect(() => {
    if (loading) {
      return;
    }
    setExpressions(data || []);
  }, [data, loading]);

  return (
    <>
      <Hero />
      <ExpressionList
        loading={loading}
        expressions={expressions}
        filters={filters}
        onFilterChange={setFilters}
        startCollapsed={true}
        openModals
      />
    </>
  );
};

export default ExpressionListPage;
