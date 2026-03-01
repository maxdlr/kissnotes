"use client";

import type { KRes, Model } from "@kissnotes/types";
import useSWR from "swr";

const useBrowse = <T extends Model>(model: string, params?: Partial<T>) => {
  const { data, error } = useSWR<KRes<T>>({
    url: `/${model}/browse`,
    params,
  });
  return { expressions: data, error };
};

export default useBrowse;
