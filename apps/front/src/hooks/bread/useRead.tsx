"use client";

import type { KRes, Model } from "@kissnotes/types";
import useSWR from "swr";

const useRead = <T extends Model>(
  model: string,
  modelParams: Partial<T>,
  fetchIf: boolean = true,
) => {
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

  const { data, error } = useSWR<KRes<T>>({
    url,
    params,
  });
  return { data, error };
};

export default useRead;
