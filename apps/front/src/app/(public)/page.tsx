"use client";
import ExpressionList from "@/app/(public)/_components/ExpressionList";
import type { SidebarValue } from "@/app/(public)/_components/ExpressionListSidebar/ExpressionListSidebar";
import ToggleButtons from "@/components/Button/ToggleButtons/ToggleButtons";
import Hero from "@/components/Hero";
import useAuth from "@/contexts/AuthContext/useAuth";
import useBrowse from "@/hooks/bread/useBrowse";
import {
  GlobeEuropeAfricaIcon,
  HandRaisedIcon,
} from "@heroicons/react/24/outline";
import type {
  ExpressionModel,
  ExpressionSymbol,
  UserModel,
} from "@kissnotes/types";
import { useMemo, useState } from "react";

const ExpressionListPage = () => {
  const auth = useAuth();
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
        ActionSlot={
          auth?.user && (
            <ToggleButtons
              value={filters?.author ? "mine" : "all"}
              onChange={(v) =>
                setFilters({
                  ...filters,
                  author: v === "mine" ? auth.user : null,
                })
              }
              buttons={[
                {
                  value: "all",
                  label: "All",
                  Icon: GlobeEuropeAfricaIcon,
                },
                {
                  value: "mine",
                  label: "Mine",
                  Icon: HandRaisedIcon,
                },
              ]}
              size="sm"
            />
          )
        }
      />
    </>
  );
};

export default ExpressionListPage;
