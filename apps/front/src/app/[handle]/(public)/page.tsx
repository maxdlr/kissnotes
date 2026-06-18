"use client";
import ExpressionList from "@/app/(public)/_components/ExpressionList";
import type { SidebarValue } from "@/app/(public)/_components/ExpressionListSidebar/ExpressionListSidebar";
import Button from "@/components/Button";
import UserHero from "@/components/UserHero";
import useAuth from "@/contexts/AuthContext/useAuth";
import useUser from "@/contexts/UserContext";
import useBrowse from "@/hooks/bread/useBrowse";
import { getHandle, getUsername } from "@/utils/userUtils";
import { PlusIcon } from "@heroicons/react/24/outline";
import type {
  ExpressionModel,
  ExpressionSymbol,
  UserModel,
} from "@kissnotes/types";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";

const ProfilePage = () => {
  const { handle } = useParams();
  const { isAuthUser } = useAuth();
  const [showDrafts, setShowDrafts] = useState(false);
  const [filters, setFilters] = useState<SidebarValue>({
    tokens: [],
    search: "",
  });

  const { user } = useUser();

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

  const expressions = useMemo(
    () => data?.filter((e) => e.published === !showDrafts) || [],
    [data, showDrafts],
  );

  const draftCount = useMemo(
    () => data?.filter((e) => e.published === false)?.length || 0,
    [data],
  );

  const isAuth = isAuthUser(user) && user?.username === getUsername(handle);

  return (
    <div className="space-y-8">
      <UserHero />
      {!expressionLoading && !expressions?.length && isAuth ? (
        <div className="w-full flex items-center justify-center">
          <Button
            label="Add an expression"
            Icon={PlusIcon}
            variant="outline"
            href={`/add`}
          />
        </div>
      ) : (
        <>
          {isAuth && (
            <div className="w-full flex items-center justify-center">
              <Button
                label="Add an expression"
                Icon={PlusIcon}
                variant="outline-accent"
                href={`/add`}
                size="sm"
              />
            </div>
          )}
          <ExpressionList
            expressions={expressions}
            filters={filters}
            onFilterChange={setFilters}
            startCollapsed
            urlScope={`/${getHandle(handle)}`}
            loading={expressionLoading}
            ActionSlot={
              isAuth && (
                <Button
                  loading={expressionLoading || !draftCount}
                  label={`Drafts (${draftCount})`}
                  onClick={() => setShowDrafts((v) => !v)}
                  variant={showDrafts ? "fill" : "outline-accent"}
                  size="sm"
                />
              )
            }
          />
        </>
      )}
    </div>
  );
};
export default ProfilePage;
