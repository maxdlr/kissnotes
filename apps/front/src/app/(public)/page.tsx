"use client";
import ExpressionList from "@/app/(public)/_components/ExpressionList";
import type { SidebarValue } from "@/app/(public)/_components/ExpressionListSidebar";
import Button from "@/components/Button";
import Hero from "@/components/Hero";
import ToggleButtons from "@/components/ToggleButtons";
import useAuth from "@/contexts/AuthContext/useAuth";
import useBrowse from "@/hooks/bread/useBrowse";
import useDebounce from "@/hooks/useDebounce";
import useExpressions from "@/hooks/useExpressions";
import { arrayUnique } from "@/utils/arrayUtils";
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
import { ElementType, useEffect, useMemo, useRef, useState } from "react";

const ExpressionListPage = () => {
  const auth = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const listParam = searchParams.get("list") || "all";
  const [listMode, setListMode] = useState<
    "saved" | "native" | "all" | "mine" | string
  >(listParam);
  const [filters, setFilters] = useState<SidebarValue>(
    listParam === "native"
      ? { search: "", saved: false, native: true }
      : { author: null, tokens: [], search: "", saved: false, native: false },
  );

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

  // Accumulate token and author options so they never shrink when filtering
  const accumulatedTokensRef = useRef<ExpressionToken[]>([]);
  const accumulatedAuthorsRef = useRef<UserModel[]>([]);

  const { getTokens } = useExpressions((data as ExpressionModel[]) || []);

  const currentTokens = useMemo(
    () => getTokens(["functions", "methods", "properties"]),
    [getTokens],
  );

  const currentAuthors = useMemo(() => {
    if (!data || listMode === "native") return [];
    return arrayUnique(
      (data as ExpressionModel[])
        .map((e) => e.author)
        .filter((a): a is UserModel => !!a),
      "username",
    );
  }, [data, listMode]);

  useEffect(() => {
    if (currentTokens.length > 0) {
      accumulatedTokensRef.current = arrayUnique(
        [...accumulatedTokensRef.current, ...currentTokens],
        "title",
      );
    }
  }, [currentTokens]);

  useEffect(() => {
    if (currentAuthors.length > 0) {
      accumulatedAuthorsRef.current = arrayUnique(
        [...accumulatedAuthorsRef.current, ...currentAuthors],
        "username",
      );
    }
  }, [currentAuthors]);

  // Use state to trigger re-renders when accumulated values change
  const [tokenOptions, setTokenOptions] = useState<ExpressionToken[]>([]);
  const [authorOptions, setAuthorOptions] = useState<UserModel[]>([]);

  useEffect(() => {
    if (currentTokens.length > 0) {
      setTokenOptions(accumulatedTokensRef.current);
    }
  }, [currentTokens]);

  useEffect(() => {
    if (currentAuthors.length > 0) {
      setAuthorOptions(accumulatedAuthorsRef.current);
    }
  }, [currentAuthors]);

  const handleModes = (value: string) => {
    setListMode(value);

    if (value === "native") {
      setFilters((f) => ({ ...f, saved: false, native: true }));
    } else {
      setFilters((f) => ({
        ...f,
        author: value === "mine" ? auth.user : f?.author,
        saved: value === "saved",
        native: false,
      }));
    }
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

  const handleFilterChange = (newFilters: SidebarValue) => {
    setFilters(newFilters);
    handleModes(newFilters?.native === true ? "native" : "all");
  };

  return (
    <>
      <Hero />
      <ExpressionList
        loading={userLoading}
        expressions={expressions}
        filters={filters}
        onFilterChange={handleFilterChange}
        startCollapsed={true}
        openModals
        tokenOptions={tokenOptions}
        authorOptions={authorOptions}
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
