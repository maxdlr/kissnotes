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
import { useCallback, useMemo, useReducer, useState } from "react";
import useSWR from "swr";
import { arrayUnique } from "@/utils/arrayUtils";

export type BrowseMode = "all" | "mine" | "saved" | "native" | "community";

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

type AccState = {
  tokens: ExpressionToken[];
  authors: UserModel[];
};

type AccAction =
  | { type: "accumulate"; results: BrowseResult[]; mode: BrowseMode }
  | { type: "reset" };

const accReducer = (state: AccState, action: AccAction): AccState => {
  if (action.type === "reset") {
    return { tokens: [], authors: [] };
  }

  const { results, mode } = action;

  const newTokens: ExpressionToken[] = results
    .filter((r) => r.symbols)
    .flatMap((r) => {
      const symbols = r.symbols as { tokens?: ExpressionToken[] };
      return symbols?.tokens || [];
    });

  const newAuthors: UserModel[] =
    mode === "native"
      ? []
      : results
          .filter((r) => !r.native && r.author?.username)
          .map((r) => r.author as UserModel);

  const tokens = newTokens.length
    ? arrayUnique([...state.tokens, ...newTokens], "title")
    : state.tokens;

  const authors = newAuthors.length
    ? arrayUnique([...state.authors, ...newAuthors], "username")
    : state.authors;

  // Only return new object if something actually changed
  if (tokens === state.tokens && authors === state.authors) return state;
  return { tokens, authors };
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
  const [acc, dispatchAcc] = useReducer(accReducer, {
    tokens: [],
    authors: [],
  });

  const debouncedSearch = useDebounce(filters.search, 400);

  // Build query params for the unified endpoint
  const userId = auth?.user?.id;
  const queryParams = useMemo(() => {
    const params: Record<string, string | number> = { mode };

    if (debouncedSearch) params.search = debouncedSearch;
    if (filters.tokens.length) {
      params.tokens = filters.tokens.map((t) => t.title).join(",");
    }
    if (mode === "mine" && userId) {
      params.authorId = userId as number;
    }
    if (filters.author?.id && mode !== "mine") {
      params.authorId = filters.author.id as number;
    }
    if (mode === "saved" && userId) {
      params.userId = userId as number;
    }
    params.maxResults = 50;

    return params;
  }, [mode, debouncedSearch, filters.tokens, filters.author, userId]);

  const { data, error, isLoading } = useSWR<BrowseResult[]>(
    { url: "/search/browse", params: queryParams },
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      keepPreviousData: true,
      onSuccess: (newData) => {
        dispatchAcc({ type: "accumulate", results: newData, mode });
      },
    },
  );

  const results = useMemo(() => data || [], [data]);

  const tokenOptions = acc.tokens;
  const authorOptions = mode === "native" ? [] : acc.authors;

  const changeMode = useCallback(
    (newMode: BrowseMode) => {
      setMode(newMode);
      dispatchAcc({ type: "reset" });

      setFilters((f) => ({
        ...f,
        native: newMode === "native",
        author: newMode === "mine" ? (auth?.user ?? null) : null,
      }));
      window.history.replaceState(null, "", `?list=${newMode}`);
    },
    [auth?.user],
  );

  const updateFilters = useCallback(
    (partial: Partial<BrowseFilters>) => {
      if ("native" in partial && partial.native !== (mode === "native")) {
        const newMode = partial.native ? "native" : "all";
        setMode(newMode);
        dispatchAcc({ type: "reset" });
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
