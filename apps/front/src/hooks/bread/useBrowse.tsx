"use client";

import type { KRes, Model } from "@kissnotes/types";
import useSWR from "swr";

const useBrowse = <T extends Model[]>(
  model: string,
  params?: Partial<
    Record<keyof T[number], T[number][keyof T[number]] | null | undefined>
  >,
) => {
  const filteredParams = params
    ? (Object.fromEntries(
        Object.entries(params).filter(([, v]) => v != null),
      ) as Partial<T[number]>)
    : undefined;

  const { data, error, isLoading, mutate } = useSWR<KRes<T>>({
    url: `/${model}/browse`,
    params: filteredParams,
  });
  return { data, error, isLoading, mutate };
};

export default useBrowse;
