"use client";

import type { KissApiError, Model } from "@kissnotes/types";
import type { AxiosError } from "axios";
import { SWRConfig } from "swr";
import axios from "@/services/axios";

const onError = (err: AxiosError) => {
  const kissError: KissApiError = err?.response?.data as KissApiError;
  return kissError;
};

const fetcher = async ({ url, params }: { url: string; params: Model }) => {
  try {
    const res = await axios.get(url, { params });
    return res?.data?.data;
  } catch (error) {
    const kissError: KissApiError = (error as AxiosError)?.response
      ?.data as KissApiError;
    if (process.env.NODE_ENV === "development") {
      console.log({ "----- kissError -----": `${kissError?.message}` });
    }
    throw kissError;
  }
};

export function Providers({ children }: { children: React.ReactNode }) {
  return <SWRConfig value={{ fetcher, onError }}>{children}</SWRConfig>;
}
