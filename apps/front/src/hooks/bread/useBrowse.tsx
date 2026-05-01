"use client";

import type { KRes, Model, UserModel } from "@kissnotes/types";
import { useEffect, useState } from "react";
import useSWR, { SWRConfiguration } from "swr";

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
      onSuccess: () => {
        setTimeout(() => setLoading(false), 500);
      },
      onError: () => {
        setTimeout(() => setLoading(false), 500);
      },
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      retryCount: 3,
      revalidateOnMount: true,
      loadingTimeout: 5000,
    } as SWRConfiguration<KRes<T>>,
  );

  useEffect(() => console.log(loading), [loading]);

  return { data: data || [1, 2, 3], error, loading, mutate };
};

export default useBrowse;
