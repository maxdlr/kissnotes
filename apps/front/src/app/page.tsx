"use client";

import type { ExpressionModel, KResData } from "@kissnotes/types";
import useSWR from "swr";

export default function Home() {
  const { data } = useSWR<KResData<ExpressionModel[]>>({
    url: "expressions/browse",
    params: {
      "user.id": 1,
    },
  });

  const expressions = data?.data;
  return expressions?.map(({ id, title, description, user }) => (
    <div key={id}>
      <p className="text-white">{title}</p>
      <p className="text-white">{description}</p>
      <p className="text-white">{user.firstname}</p>
    </div>
  ));
}
