import { useLayoutEffect, useEffect } from "react";
import { MasonryBreakpoints } from "./interfaces";

export const resolveColumns = (
  bp: MasonryBreakpoints,
  containerWidth: number,
): number => {
  const sorted = Object.keys(bp)
    .map(Number)
    .sort((a, b) => a - b);

  let result = 1;
  for (const minWidth of sorted) {
    if (containerWidth >= minWidth) result = bp[minWidth];
  }
  return Math.max(1, result);
};

export const distributeChildren = (
  count: number,
  columnCount: number,
  heights: number[],
): number[][] => {
  const cols: number[][] = Array.from({ length: columnCount }, () => []);
  const colHeights = new Array<number>(columnCount).fill(0);

  for (let i = 0; i < count; i++) {
    // Find column with smallest cumulative height
    const shortest = colHeights.indexOf(Math.min(...colHeights));
    cols[shortest].push(i);
    colHeights[shortest] += heights[i] ?? 0;
  }

  return cols;
};

export const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;
