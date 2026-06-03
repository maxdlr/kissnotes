"use client";
import type {
  ExpressionModel,
  ExpressionSymbol,
  UserModel,
} from "@kissnotes/types";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ExpressionList from "@/app/(public)/_components/ExpressionList";
import type { SidebarValue } from "@/app/(public)/_components/ExpressionListSidebar/ExpressionListSidebar";
import UserHero from "@/components/UserHero";
import useBrowse from "@/hooks/bread/useBrowse";
import { getHandle } from "@/utils/userUtils";
import Button from "@/components/Button";
import { PlusIcon } from "@heroicons/react/24/outline";
import useAuth from "@/contexts/AuthContext/useAuth";
import useUser from "@/contexts/UserContext";

const ProfilePage = () => {
  const { handle } = useParams();
  const { user: authUser } = useAuth();
  const [filters, setFilters] = useState<SidebarValue>({
    tokens: [],
    search: "",
  });

  const { user } = useUser();

  const [expressions, setExpressions] = useState<ExpressionModel[]>([]);

  const { data, loading: expressionLoading } = useBrowse<ExpressionModel[]>(
    "expressions",
    {
      author: user?.id ? ({ id: user.id as string } as UserModel) : undefined,
      symbols: {
        tokens: [...(filters?.tokens || []).map((t) => t.title)],
      } as ExpressionSymbol,
      search: filters?.search,
    },
  );

  useEffect(() => setExpressions(data as ExpressionModel[]), [data]);

  return (
    <div className="space-y-8">
      <UserHero />
      {!expressionLoading && !expressions?.length ? (
        <div className="w-full flex items-center justify-center">
          <Button
            label="Add an expression"
            Icon={PlusIcon}
            variant="outline"
            href={`/exp/add`}
          />
        </div>
      ) : (
        <>
          <div className="w-full flex items-center justify-center">
            <Button
              label="Add an expression"
              Icon={PlusIcon}
              variant="outline-accent"
              href={`/exp/add`}
              size="sm"
            />
          </div>
          <ExpressionList
            expressions={expressions}
            filters={filters}
            onFilterChange={setFilters}
            startCollapsed
            urlScope={`/${getHandle(handle)}`}
            loading={expressionLoading}
          />
        </>
      )}
    </div>
  );
};
export default ProfilePage;
