"use client";

import { MotionConfig } from "motion/react";
import { SWRConfig } from "swr";
import { AuthProvider } from "@/hooks/AuthProvider";
import fetcher, { onError } from "@/services/fetcher";

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
