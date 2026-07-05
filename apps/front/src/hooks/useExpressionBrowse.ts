"use client";

import useAuth from "@/contexts/AuthContext/useAuth";
import useDebounce from "@/hooks/useDebounce";
import type {
  CodeModel,
  ExpressionSymbol,
  ExpressionToken,
  Id,
  LayerModel,
  PropertyModel,
  UserModel,
} from "@kissnotes/types";
import { useCallback, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { arrayUnique } from "@/utils/arrayUtils";

export type BrowseMode = "all" | "mine" | "saved" | "native";

export interface BrowseFilters {
  search: string;
  tokens: ExpressionToken[];
  author: UserModel | null;
  native: boolean;
}

export interface BrowseResult {
  id: Id;
  title: string;
  description?: string;
  code?: CodeModel;
  layer?: LayerModel;
  property?: PropertyModel;
  symbols?: ExpressionSymbol;
  author?: { id: Id; username: string };
  views?: number;
  createdAt?: Date;
  native: boolean;
  score: number;
}

const DEFAULT_FILTERS: BrowseFilters = {
  search: "",
  tokens: [],
  author: null,
  native: false,
};

/**
 * Encapsulates mode, filters, fetching, and option accumulation
 * for the expression browse page.
 * Mode is the single source of truth — filters.native derives from it.
 */
const useExpressionBrowse = (initialMode: BrowseMode = "all") => {
  const auth = useAuth();
  const [mode, setMode] = useState<BrowseMode>(initialMode);
  const [filters, setFilters] = useState<BrowseFilters>(DEFAULT_FILTERS);

  const debouncedSearch = useDebounce(filters.search, 400);

  // Build query params for the unified endpoint
  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = { mode };

    if (debouncedSearch) params.search = debouncedSearch;
    if (filters.tokens.length) {
      params.tokens = filters.tokens.map((t) => t.title).join(",");
    }
    if (mode === "mine" && auth?.user?.id) {
      params.authorId = auth.user.id as number;
    }
    if (filters.author?.id && mode !== "mine") {
      params.authorId = filters.author.id as number;
    }
    if (mode === "saved" && auth?.user?.id) {
      params.userId = auth.user.id as number;
    }
    params.maxResults = 50;

    return params;
  }, [mode, debouncedSearch, filters.tokens, filters.author, auth?.user?.id]);

  const { data, error, isLoading } = useSWR<BrowseResult[]>(
    { url: "/search/browse", params: queryParams },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      keepPreviousData: true,
    },
  );

  const results: BrowseResult[] = data || [];

  // Accumulate token and author options so they never shrink within a mode
  const accTokensRef = useRef<ExpressionToken[]>([]);
  const accAuthorsRef = useRef<UserModel[]>([]);
  const prevModeRef = useRef<BrowseMode>(initialMode);

  // Reset accumulated options on mode change
  if (prevModeRef.current !== mode) {
    accTokensRef.current = [];
    accAuthorsRef.current = [];
    prevModeRef.current = mode;
  }

  // Derive token options from current results
  const tokenOptions = useMemo(() => {
    const tokens: ExpressionToken[] = results
      .filter((r) => r.symbols)
      .flatMap((r) => {
        const symbols = r.symbols as { tokens?: ExpressionToken[] };
        return symbols?.tokens || [];
      });

    if (tokens.length) {
      accTokensRef.current = arrayUnique(
        [...accTokensRef.current, ...tokens],
        "title",
      );
    }
    return accTokensRef.current;
  }, [results]);

  // Derive author options from current results (not relevant for native)
  const authorOptions = useMemo(() => {
    if (mode === "native") return [];
    const authors = results
      .filter((r) => !r.native && r.author?.username)
      .map((r) => r.author as UserModel);

    if (authors.length) {
      accAuthorsRef.current = arrayUnique(
        [...accAuthorsRef.current, ...authors],
        "username",
      );
    }
    return accAuthorsRef.current;
  }, [results, mode]);

  // Change mode — this is the primary state change
  const changeMode = useCallback(
    (newMode: BrowseMode) => {
      setMode(newMode);
      // Reset mode-specific filters
      setFilters((f) => ({
        ...f,
        native: newMode === "native",
        author: newMode === "mine" ? auth?.user ?? null : null,
      }));
      window.history.replaceState(null, "", `?list=${newMode}`);
    },
    [auth?.user],
  );

  // Update filters without changing mode (for sidebar inputs)
  const updateFilters = useCallback(
    (partial: Partial<BrowseFilters>) => {
      // If native flag changed via sidebar dropdown, sync mode
      if ("native" in partial && partial.native !== (mode === "native")) {
        const newMode = partial.native ? "native" : "all";
        setMode(newMode);
        window.history.replaceState(null, "", `?list=${newMode}`);
      }

      setFilters((f) => ({ ...f, ...partial }));
    },
    [mode],
  );

  return {
    mode,
    filters,
    results,
    loading: isLoading && !data,
    error,
    tokenOptions,
    authorOptions,
    changeMode,
    updateFilters,
  };
};

export default useExpressionBrowse;
