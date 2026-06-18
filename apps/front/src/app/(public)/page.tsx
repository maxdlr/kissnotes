"use client";
import ExpressionList from "@/app/(public)/_components/ExpressionList";
import type { SidebarValue } from "@/app/(public)/_components/ExpressionListSidebar/ExpressionListSidebar";
import Hero from "@/components/Hero";
import useBrowse from "@/hooks/bread/useBrowse";
import type {
  ExpressionModel,
  ExpressionSymbol,
  UserModel,
} from "@kissnotes/types";
import { useMemo, useState } from "react";

const ExpressionListPage = () => {
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

  const expressions = useMemo(
    () => data?.filter((e) => !!e.published) || [],
    [data],
  );

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
