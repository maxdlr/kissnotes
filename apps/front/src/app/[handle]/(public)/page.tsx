"use client";
import ExpressionList from "@/app/(public)/_components/ExpressionList";
import type { SidebarValue } from "@/app/(public)/_components/ExpressionListSidebar/ExpressionListSidebar";
import Button from "@/components/Button";
import ToggleButtons from "@/components/ToggleButtons";
import UserHero from "@/components/UserHero";
import useAuth from "@/contexts/AuthContext/useAuth";
import useUser from "@/contexts/UserContext";
import useBrowse from "@/hooks/bread/useBrowse";
import useDebounce from "@/hooks/useDebounce";
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

  const debouncedSearch = useDebounce(filters?.search, 400);

  const { data, loading: expressionLoading } = useBrowse<ExpressionModel[]>(
    "expressions",
    {
      author: user?.id ? ({ id: user.id as string } as UserModel) : undefined,
      symbols: {
        tokens: [...(filters?.tokens || []).map((t) => t.title)],
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

  const isAuth = isAuthUser(user) && user?.username === getUsername(handle);

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
          ActionSlot={
            isAuth && (
              <ToggleButtons
                value={showDrafts ? "drafts" : "published"}
                onChange={(v) => setShowDrafts(v === "drafts")}
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
                size="sm"
              />
            )
          }
        />
      </>
    </div>
  );
};
export default ProfilePage;
