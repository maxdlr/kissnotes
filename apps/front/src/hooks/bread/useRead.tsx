"use client";

import type { KRes, Model } from "@kissnotes/types";
import { useState } from "react";
import useSWR from "swr";

const useRead = <T extends Model>(
  model: string,
  modelParams: Partial<T>,
  fetchIf: boolean = true,
) => {
  const [loading, setLoading] = useState(true);
  const params: Partial<T> = Object.entries(modelParams).reduce(
    // biome-ignore lint/suspicious/noExplicitAny: don't care
    (acc: Partial<T>, value: [string, any]) => {
      if (modelParams[value[0] as keyof Partial<T>]) {
        acc[value[0] as keyof T] = value[1];
      }
      return acc;
    },
    {} as Partial<T>,
  );

  const url = fetchIf ? `/${model}/read` : null;

  const { data, error } = useSWR<KRes<T>>(
    {
      url,
      params,
    },
    {
      onSuccess: () => setLoading(false),
      onError: () => setLoading(false),
    },
  );
  return { data, error, loading };
};

export default useRead;
