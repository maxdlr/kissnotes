"use client";
import type { ExpressionModel, UserModel } from "@kissnotes/types";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ExpressionList } from "@/app/(public)/_components/ExpressionList";
import type { SidebarValue } from "@/app/(public)/_components/ExpressionListSidebar/ExpressionListSidebar";
import { UserHero } from "@/components/UserHero";
import useBrowse from "@/hooks/bread/useBrowse";
import { getHandle } from "@/utils/getProfileHref";
import useUser from "./hooks/UserContext";

const ProfilePage = () => {
  const router = useRouter();
  const { handle } = useParams();
  const [expressions, setExpressions] = useState<ExpressionModel[]>([]);
  const [filters, setFilters] = useState<SidebarValue>({
    tokens: [],
    search: "",
  });

  const { user, loading } = useUser();

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
    return "loading user";
  }

  if (!user) {
    router.back();
    return;
  }

  return (
    <>
      <UserHero />
      {expressions && (
        <ExpressionList
          expressions={expressions}
          filters={filters}
          onFilterChange={setFilters}
          startCollapsed
          urlScope={`/${getHandle(handle)}`}
        />
      )}
    </>
  );
};
export default ProfilePage;
