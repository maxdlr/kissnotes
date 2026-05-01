"use client";
import type {
  ExpressionModel,
  ExpressionSymbol,
  UserModel,
} from "@kissnotes/types";
import { useParams, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";
import ExpressionList from "@/app/(public)/_components/ExpressionList";
import type { SidebarValue } from "@/app/(public)/_components/ExpressionListSidebar/ExpressionListSidebar";
import UserHero from "@/components/UserHero";
import useBrowse from "@/hooks/bread/useBrowse";
import { getHandle } from "@/utils/userUtils";
import useUser from "./hooks/UserContext";
import Loading from "@/components/Loading";

const ProfilePage = () => {
  const { handle } = useParams();
  const [filters, setFilters] = useState<SidebarValue>({
    tokens: [],
    search: "",
  });

  const { user, loading: userLoading } = useUser();

  const [expressions, setExpressions] = useState<ExpressionModel[]>([]);

  const { data, loading: expressionLoading } = useBrowse<ExpressionModel[]>(
    "expressions",
    {
      author: { id: user?.id as string } as UserModel,
      symbols: {
        tokens: [...(filters?.tokens || []).map((t) => t.title)],
      } as ExpressionSymbol,
      search: filters?.search,
    },
  );

  useEffect(() => setExpressions(data as ExpressionModel[]), [data]);

  return (
    <>
      {userLoading ? <Loading /> : <UserHero />}
      {expressionLoading ? (
        <Loading />
      ) : (
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
