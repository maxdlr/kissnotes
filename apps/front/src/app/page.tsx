"use client";

import type { ExpressionModel, KRes } from "@kissnotes/types";
import useSWR from "swr";

export default function Home() {
  const { data: exp } = useSWR<KRes<ExpressionModel>>({
    url: "expressions/read",
    params: {
      id: 5,
    },
  });
  // return user?.map(({ id, title, description, user }) => (
  //   <div key={id}>
  //     <p className="text-white">{title}</p>
  //     <p className="text-white">{description}</p>
  //     <p className="text-white">{user.firstname}</p>
  //   </div>
  // ));
  console.log({ exp });
  return exp?.code.lines.map(({ number, content }) => (
    <div key={number} className="flex justify-start items-baseline gap-2">
      <p>{number}</p>
      <p>{content}</p>
    </div>
  ));
}
