"use client";
import ExpressionList from "@/app/(public)/_components/ExpressionList";
import type { SidebarValue } from "@/app/(public)/_components/ExpressionListSidebar";
import Button from "@/components/Button";
import Hero from "@/components/Hero";
import ToggleButtons from "@/components/ToggleButtons";
import useAuth from "@/contexts/AuthContext/useAuth";
import useBrowse from "@/hooks/bread/useBrowse";
import useDebounce from "@/hooks/useDebounce";
import { asTitle } from "@/utils/stringUtils";
import { getProfileHref } from "@/utils/userUtils";
import { BookmarkIcon, HeartIcon } from "@heroicons/react/16/solid";
import {
  ArrowUpLeftIcon,
  CodeBracketIcon,
  GlobeEuropeAfricaIcon,
} from "@heroicons/react/24/outline";
import type {
  ExpressionModel,
  ExpressionSymbol,
  ExpressionToken,
  NativeExpressionModel,
  UserModel,
} from "@kissnotes/types";
import { useRouter, useSearchParams } from "next/navigation";
import { ElementType, useMemo, useState } from "react";

const ExpressionListPage = () => {
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const listParam = searchParams.get("list") || "all";
  const [listMode, setListMode] = useState<
    "saved" | "native" | "all" | "mine" | string
  >(listParam);
  const [filters, setFilters] = useState<SidebarValue>({
    author: null,
    tokens: [],
    search: "",
    saved: false,
    native: false,
  });

  const debouncedSearch = useDebounce(filters?.search, 400);

  const { data, loading: userLoading } = useBrowse<
    ExpressionModel[] | NativeExpressionModel[]
  >(
    ["mine", "saved"].includes(listMode)
      ? "expressions"
      : listMode === "native"
        ? "native-expressions"
        : "search",
    {
      author: { id: filters?.author?.id as number } as UserModel,
      symbols: {
        tokens: [
          ...(filters?.tokens || []).map((t: ExpressionToken) => t.title),
        ],
      } as ExpressionSymbol,
      search: debouncedSearch,
      ...(listMode === "native" ? {} : { published: true }),
      saves:
        listMode === "saved"
          ? { user: { id: auth?.user?.id as number } }
          : null,
    },
  );

  const expressions =
    listMode === "native" && data
      ? data
          .filter((ne) => !!(ne as NativeExpressionModel).code)
          .map((ne) => {
            return {
              id: (ne as NativeExpressionModel).id,
              title: asTitle((ne as NativeExpressionModel).title),
              description: (ne as NativeExpressionModel).description,
              code: (ne as NativeExpressionModel).code,
              native: true,
            };
          })
          .flat()
      : data || [];

  const handleModes = (value: string) => {
    setListMode(value);
    setFilters({
      ...filters,
      author: value === "mine" ? auth.user : null,
      saved: value === "saved",
      native: value === "native",
    });
    router.push(`?list=${value}`);
  };

  const modeButtons: {
    value: string;
    label: string;
    Icon: ElementType;
  }[] = useMemo(
    () =>
      [
        {
          value: "all",
          label: "All",
          Icon: GlobeEuropeAfricaIcon,
        },
        auth?.user && {
          value: "mine",
          label: "Mine",
          Icon: HeartIcon,
        },
        auth?.user && {
          value: "saved",
          label: "Saved",
          Icon: BookmarkIcon,
        },
        {
          value: "native",
          label: "Native",
          Icon: CodeBracketIcon,
        },
      ].filter(Boolean),
    [auth?.user],
  );

  return (
    <>
      <Hero />
      <ExpressionList
        native={listMode === "native"}
        loading={userLoading}
        expressions={expressions}
        filters={filters}
        onFilterChange={setFilters}
        startCollapsed={true}
        openModals
        ActionSlot={
          <ToggleButtons
            value={listMode}
            onChange={handleModes}
            buttons={modeButtons}
            size="sm"
          />
        }
        emptyMsg={
          listMode === "saved" ? (
            <div className="flex flex-col items-center justify-center gap-4 pt-8">
              <p>You haven&apos;t saved any expression yet.</p>
              <Button
                label="Browse expressions"
                onClick={() => setListMode("all")}
                Icon={ArrowUpLeftIcon}
              />
            </div>
          ) : (
            listMode === "mine" && (
              <div className="flex flex-col items-center justify-center gap-4 pt-8">
                <p>No published expression yet.</p>
                {auth?.user && (
                  <Button
                    label="See my drafts"
                    href={`${getProfileHref(auth?.user?.username)}?list=drafts`}
                    Icon={ArrowUpLeftIcon}
                  />
                )}
              </div>
            )
          )
        }
      />
    </>
  );
};

export default ExpressionListPage;
