"use client";

import type { Test } from "@kissnotes/types";
import useSWR from "swr";

export default function Home() {
  const { data } = useSWR<Test>("/test");
  return <p className="text-white">{data?.message}</p>;
}
