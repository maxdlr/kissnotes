"use client";
import type { ExpressionModel, UserModel } from "@kissnotes/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExpressionList } from "@/components/ExpressionList";
import type { SidebarValue } from "@/components/ExpressionListSidebar/ExpressionListSidebar";
import useBrowse from "@/hooks/bread/useBrowse";
import useRead from "@/hooks/bread/useRead";
import { getUsername } from "@/utils/getProfileHref";

const ProfilePage = () => {
  const { handle } = useParams();
  const router = useRouter();
  const [expressions, setExpressions] = useState<ExpressionModel[]>([]);
  const [filters, setFilters] = useState<SidebarValue>({
    tokens: [],
    search: "",
  });

  const { data: user, loading } = useRead<UserModel>("users", {
    username: getUsername(handle),
  });
  const { data } = useBrowse<ExpressionModel[]>("expressions", {
    author: { id: user?.id as string } as UserModel,
    symbols: filters?.tokens
      ? { tokens: [...filters.tokens.map((t) => t.title)] }
      : null,
    search: filters?.search,
  });

  useEffect(() => {
    setExpressions(data || []);
  }, [data]);

  if (loading) {
    return "expression list loading";
  }

  if (loading) {
    return "loading user";
  }

  if (!user) {
    router.back();
    return;
  }

  return (
    expressions && (
      <ExpressionList
        expressions={expressions}
        filters={filters}
        onFilterChange={setFilters}
        startCollapsed
      />
    )
  );
};
export default ProfilePage;
