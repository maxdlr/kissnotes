"use client";
import ExpressionList from "@/app/(public)/_components/ExpressionList";
import type { SidebarValue } from "@/app/(public)/_components/ExpressionListSidebar";
import Button from "@/components/Button";
import ToggleButtons from "@/components/ToggleButtons";
import UserHero from "@/components/UserHero";
import useAuth from "@/contexts/AuthContext/useAuth";
import useUser from "@/contexts/UserContext";
import useBrowse from "@/hooks/bread/useBrowse";
import useBreakpoints from "@/hooks/useBreakpoints";
import useDebounce from "@/hooks/useDebounce";
import useExpressions from "@/hooks/useExpressions";
import { getHandle, getUsername } from "@/utils/userUtils";
import {
  DocumentTextIcon as OutlineDocumentTextIcon,
  PencilSquareIcon as OutlinePencilSquareIcon,
  PlusIcon as OutlinePlusIcon,
} from "@heroicons/react/24/outline";
import {
  DocumentTextIcon as SolidDocumentTextIcon,
  PencilSquareIcon as SolidPencilSquareIcon,
} from "@heroicons/react/24/solid";
import type {
  ExpressionModel,
  ExpressionSymbol,
  ExpressionToken,
  UserModel,
} from "@kissnotes/types";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";

const ProfilePage = () => {
  const { handle } = useParams();
  const { isAuthUser } = useAuth();
  const searchParams = useSearchParams();
  const list = searchParams.get("list") || "published";
  const [showDrafts, setShowDrafts] = useState(list === "drafts");
  const router = useRouter();
  const [filters, setFilters] = useState<SidebarValue>({
    tokens: [],
    search: "",
  });

  const { user } = useUser();
  const { sm } = useBreakpoints();

  const debouncedSearch = useDebounce(filters?.search, 400);

  const { data, loading: expressionLoading } = useBrowse<ExpressionModel[]>(
    "expressions",
    {
      author: user?.id ? ({ id: user.id as string } as UserModel) : undefined,
      symbols: {
        tokens: [
          ...(filters?.tokens || []).map((t: ExpressionToken) => t.title),
        ],
      } as ExpressionSymbol,
      search: debouncedSearch,
    },
  );

  const expressions = useMemo(
    () => ({
      published: data?.filter((e) => e.published === true) || [],
      drafts: data?.filter((e) => e.published === false) || [],
    }),
    [data],
  );

  // Derive token options from the full dataset (all user expressions)
  const { getTokens } = useExpressions(data || []);
  const tokenOptions = useMemo(
    () => getTokens(["functions", "methods", "properties"]),
    [getTokens],
  );

  const isAuth = isAuthUser(user) && user?.username === getUsername(handle);

  const handleShowDrafts = (value: string) => {
    setShowDrafts(value === "drafts");
    router.push(`?list=${value}`);
  };

  return (
    <div className="space-y-8">
      <UserHero />
      <>
        {isAuth && (
          <div className="w-full flex flex-col gap-4 items-center justify-center">
            <Button
              label="Add an expression"
              Icon={OutlinePlusIcon}
              variant="outline-accent"
              href={`/form/new`}
              size="sm"
            />
          </div>
        )}
        <ExpressionList
          expressions={showDrafts ? expressions.drafts : expressions.published}
          filters={filters}
          onFilterChange={setFilters}
          startCollapsed
          urlScope={`/${getHandle(handle)}`}
          loading={expressionLoading}
          tokenOptions={tokenOptions}
          authorOptions={[]}
          ActionSlot={
            isAuth && (
              <ToggleButtons
                value={showDrafts ? "drafts" : "published"}
                onChange={handleShowDrafts}
                size={sm ? "md" : "sm"}
                buttons={[
                  {
                    value: "published",
                    label: `Published (${expressions.published.length})`,
                    Icon: OutlineDocumentTextIcon,
                    HoverIcon: SolidDocumentTextIcon,
                  },
                  {
                    value: "drafts",
                    label: `Drafts (${expressions.drafts.length})`,
                    Icon: OutlinePencilSquareIcon,
                    HoverIcon: SolidPencilSquareIcon,
                  },
                ]}
              />
            )
          }
        />
      </>
    </div>
  );
};
export default ProfilePage;
