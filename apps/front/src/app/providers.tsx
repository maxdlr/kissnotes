"use client";

import { SearcherProvider } from "@/components/Searcher/hooks/SearcherProvider";
import { ToastsList } from "@/components/ToastsList";
import AuthProvider from "@/contexts/AuthContext/AuthProvider";
import { ToastsProvider } from "@/contexts/ToastsContext/ToastsContext";
import fetcher, { onError } from "@/services/fetcher";
import { MotionConfig } from "motion/react";
import { SWRConfig } from "swr";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ fetcher, onError }}>
      <ToastsProvider>
        <AuthProvider>
          <MotionConfig transition={{ duration: 0.5, ease: [0, 0.8, 0.3, 1] }}>
            <SearcherProvider>{children}</SearcherProvider>
            <ToastsList />
          </MotionConfig>
        </AuthProvider>
      </ToastsProvider>
    </SWRConfig>
  );
}
