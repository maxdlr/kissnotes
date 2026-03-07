"use client";

import type { Id, KRes, Model } from "@kissnotes/types";
import type { ParamValue } from "next/dist/server/request/params";
import useSWR from "swr";

const useRead = <T extends Model>(model: string, id?: ParamValue) => {
  if (process.env.NODE_ENV === "development" && !id) {
    console.log({ "----- kissError -----": "Id missing in useRead()" });
  }
  const { data, error } = useSWR<KRes<T>>({
    url: `/${model}/read`,
    params: { id: Number(id) as Id },
  });
  return { data, error };
};

export default useRead;
