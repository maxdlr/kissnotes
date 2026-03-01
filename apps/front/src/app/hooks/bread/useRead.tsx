"use client";

import type { Id, KRes, Model } from "@kissnotes/types";
import useSWR from "swr";

const useRead = <T extends Model>(model: string, id?: string | string[]) => {
  if (process.env.NODE_ENV === "development" && !id) {
    console.log({ "----- kissError -----": "Id missing in useRead()" });
  }
  const { data, error } = useSWR<KRes<T>>({
    url: `/${model}/read`,
    params: { id: Number(id) as Id },
  });
  return { expression: data, error };
};

export default useRead;
