"use client";
import ExpressionList from "@/app/(public)/_components/ExpressionList";
import type { SidebarValue } from "@/app/(public)/_components/ExpressionListSidebar";
import Button from "@/components/Button";
import Hero from "@/components/Hero";
import ToggleButtons from "@/components/ToggleButtons";
import useAuth from "@/contexts/AuthContext/useAuth";
import useExpressionBrowse, { BrowseMode } from "@/hooks/useExpressionBrowse";
import { getProfileHref } from "@/utils/userUtils";
import { BookmarkIcon, HeartIcon } from "@heroicons/react/16/solid";
import {
  ArrowUpLeftIcon,
  CodeBracketIcon,
  GlobeEuropeAfricaIcon,
  PlusIcon as OutlinePlusIcon,
} from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import { ElementType, Suspense, useMemo, useRef } from "react";

const ExpressionListPage = () => {
  const auth = useAuth();
  const searchParams = useSearchParams();
  const initialMode = useRef((searchParams.get("list") || "all") as BrowseMode);

  const {
    mode,
    filters,
    results,
    loading,
    tokenOptions,
    authorOptions,
    changeMode,
    updateFilters,
  } = useExpressionBrowse(initialMode.current);

  // Bridge between SidebarValue shape and the hook's flat filters
  const sidebarValue: SidebarValue = {
    search: filters.search,
    tokens: mode !== "native" ? filters.tokens : undefined,
    author: mode !== "native" ? filters.author : undefined,
    native: filters.native,
  };

  const handleSidebarChange = (newValue: SidebarValue) => {
    if (!newValue) return;

    // Extract native boolean from dropdown object if needed
    const nativeRaw = newValue.native;
    const nativeBool =
      typeof nativeRaw === "object" &&
      nativeRaw !== null &&
      "value" in nativeRaw
        ? (nativeRaw as { value: boolean }).value
        : !!nativeRaw;

    updateFilters({
      search: newValue.search ?? "",
      tokens: newValue.tokens ?? [],
      author: newValue.author ?? null,
      native: nativeBool,
    });
  };

  const modeButtons: {
    value: string;
    label: string;
    Icon: ElementType;
  }[] = useMemo(
    () =>
      [
        { value: "all", label: "All", Icon: GlobeEuropeAfricaIcon },
        { value: "community", label: "Community", Icon: GlobeEuropeAfricaIcon },
        { value: "native", label: "Native", Icon: CodeBracketIcon },
        auth?.user && { value: "mine", label: "Mine", Icon: HeartIcon },
        auth?.user && { value: "saved", label: "Saved", Icon: BookmarkIcon },
      ].filter(Boolean) as {
        value: string;
        label: string;
        Icon: ElementType;
      }[],
    [auth?.user],
  );

  return (
    <>
      <Hero />
      {auth?.user && (
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
        loading={loading}
        expressions={results}
        filters={sidebarValue}
        onFilterChange={handleSidebarChange}
        startCollapsed={true}
        openModals
        tokenOptions={tokenOptions}
        authorOptions={authorOptions}
        ActionSlot={
          <ToggleButtons
            value={mode}
            onChange={(v) => changeMode(v as BrowseMode)}
            buttons={modeButtons}
            size="sm"
          />
        }
        emptyMsg={
          mode === "saved" ? (
            <div className="flex flex-col items-center justify-center gap-4 pt-8">
              <p>You haven&apos;t saved any expression yet.</p>
              <Button
                label="Browse expressions"
                onClick={() => changeMode("all")}
                Icon={ArrowUpLeftIcon}
              />
            </div>
          ) : mode === "mine" ? (
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
          ) : (
            <div className="flex flex-col items-center justify-center gap-4 pt-8">
              <p>No expression yet.</p>
              {auth?.user && (
                <Button
                  label="Create one"
                  href="/form/new"
                  Icon={ArrowUpLeftIcon}
                />
              )}
            </div>
          )
        }
      />
    </>
  );
};

export default function ExpressionListPageWrapper() {
  return (
    <Suspense>
      <ExpressionListPage />
    </Suspense>
  );
}
