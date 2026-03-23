"use client";

import type { KissApiError, Model } from "@kissnotes/types";
import type { AxiosError } from "axios";
import { MotionConfig } from "motion/react";
import { SWRConfig } from "swr";
import privateUris from "@/enums/privateUris";
import { AuthProvider } from "@/hooks/AuthProvider";
import axios from "@/services/axios";

const onError = (err: AxiosError) => {
  const kissError: KissApiError = err?.response?.data as KissApiError;
  return kissError;
};

const fetcher = async ({ url, params }: { url: string; params: Model }) => {
  try {
    if (!url) return null;
    const res = await axios.get(url, { params });
    return res?.data?.data;
  } catch (error) {
    const kissError: KissApiError = (error as AxiosError)?.response
      ?.data as KissApiError;
    if (process.env.NODE_ENV === "development") {
      console.log({
        "----- kissError -----": `${kissError?.status} - ${kissError?.message}`,
      });
    }

    const isPrivate = privateUris.some((pattern) =>
      pattern.test(window.location.pathname),
    );

    if (kissError?.status === 401 && isPrivate) {
      window.location.href = "/";
    }

    throw kissError;
  }
};

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ fetcher, onError }}>
      <AuthProvider>
        <MotionConfig transition={{ duration: 0.5, ease: [0, 0.8, 0.3, 1] }}>
          {children}
        </MotionConfig>
      </AuthProvider>
    </SWRConfig>
  );
}
