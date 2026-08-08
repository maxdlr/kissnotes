import type { ExpressionModel } from "@kissnotes/types";

/**
 * Fetches all published expressions for the sitemap. Uses a high maxResults
 * since the endpoint defaults to 50 and the sitemap needs full coverage.
 */
export const fetchPublishedExpressions = async (): Promise<
  ExpressionModel[]
> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expressions/browse?published=true&maxResults=10000`,
    { cache: "no-store" },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch published expressions");
  }

  return res.json();
};
