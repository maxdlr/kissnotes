"use client";

import type { ExpressionModel, KResData } from "@kissnotes/types";
import useSWR from "swr";

export default function Home() {
  const { data } = useSWR<KResData<ExpressionModel>>("/test");
  return <p className="text-white">{data?.data?.id}</p>;
}
