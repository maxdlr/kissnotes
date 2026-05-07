"use client";

import type { KRes, Model } from "@kissnotes/types";
import { useState } from "react";
import useSWR, { type SWRConfiguration } from "swr";

export type BrowseFilters<T extends Model[]> = Partial<
  Record<keyof T[number], T[number][keyof T[number]] | null | undefined>
>;

const useBrowse = <T extends Model[]>(
  model: string,
  params?: BrowseFilters<T> & { search?: string },
) => {
  const [loading, setLoading] = useState<boolean>(true);
  const filteredParams = params
    ? (Object.fromEntries(
        Object.entries(params).filter(([, v]) => v != null),
      ) as Partial<T[number]>)
    : undefined;

  const { data, error, mutate } = useSWR<KRes<T>>(
    {
      url: `/${model}/browse`,
      params: filteredParams,
    },
    {
      onSuccess: () => setLoading(false),
      onError: () => setLoading(false),
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      retryCount: 3,
      revalidateOnMount: true,
      loadingTimeout: 5000,
    } as SWRConfiguration<KRes<T>>,
  );

  return { data, error, loading, mutate };
};

export default useBrowse;
