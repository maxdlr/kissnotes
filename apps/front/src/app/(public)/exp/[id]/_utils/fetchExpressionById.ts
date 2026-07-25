import { ExpressionModel } from "@kissnotes/types";

export const fetchExpressionById = async (
  id: string,
): Promise<ExpressionModel> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expressions/read?id=${id}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch expression data");
  }

  return res.json();
};
