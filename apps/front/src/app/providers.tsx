"use client";

import { MotionConfig } from "motion/react";
import { SWRConfig } from "swr";
import { ToastsList } from "@/components/ToastsList";
import AuthProvider from "@/contexts/AuthContext/AuthProvider";
import { ToastsProvider } from "@/contexts/ToastsContext/ToastsContext";
import fetcher, { onError } from "@/services/fetcher";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig value={{ fetcher, onError }}>
      <ToastsProvider>
        <AuthProvider>
          <MotionConfig transition={{ duration: 0.5, ease: [0, 0.8, 0.3, 1] }}>
            {children}
            <ToastsList />
          </MotionConfig>
        </AuthProvider>
      </ToastsProvider>
    </SWRConfig>
  );
}
