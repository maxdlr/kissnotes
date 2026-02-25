"use client";

import { SWRConfig } from "swr";
import axios from "@/services/axios";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SWRConfig
      value={{
        fetcher: (url) => axios.get(url).then((res) => res.data),
      }}
    >
      {children}
    </SWRConfig>
  );
}
