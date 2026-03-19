"use client";

import { Breakpoint } from "@/types/Breakpoints";
import {
  Children,
  type CSSProperties,
  type ReactNode,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type MasonryBreakpoints = {
  /** column count at each min-width breakpoint (px → columns) */
  [minWidth: number]: number;
};

export interface MasonryGridProps {
  /** Items to lay out – any React nodes */
  children: ReactNode;
  /**
   * Either a fixed column count or a responsive map.
   * @example columns={3}
   * @example columns={{ 0: 1, 640: 2, 1024: 3, 1440: 4 }}
   */
  columns?: number | MasonryBreakpoints;
  /** Gap between items (CSS value, e.g. "16px", "1rem"). Default: "16px" */
  gap?: string;
  /** Extra className applied to the outer wrapper */
  className?: string;
  /** Extra style applied to the outer wrapper */
  style?: CSSProperties;
  /** Called whenever the column count changes */
  onColumnsChange?: (columns: number) => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Resolve column count from breakpoints map for a given container width.
 * The largest `minWidth` that is ≤ containerWidth wins.
 */
function resolveColumns(
  bp: MasonryBreakpoints,
  containerWidth: number,
): number {
  const sorted = Object.keys(bp)
    .map(Number)
    .sort((a, b) => a - b);

  let result = 1;
  for (const minWidth of sorted) {
    if (containerWidth >= minWidth) result = bp[minWidth];
  }
  return Math.max(1, result);
}

/**
 * Distribute child indices across `columnCount` columns using a
 * shortest-column-first strategy based on recorded item heights.
 */
function distributeChildren(
  count: number,
  columnCount: number,
  heights: number[],
): number[][] {
  const cols: number[][] = Array.from({ length: columnCount }, () => []);
  const colHeights = new Array<number>(columnCount).fill(0);

  for (let i = 0; i < count; i++) {
    // Find column with smallest cumulative height
    const shortest = colHeights.indexOf(Math.min(...colHeights));
    cols[shortest].push(i);
    colHeights[shortest] += heights[i] ?? 0;
  }

  return cols;
}

const { MD, LG } = Breakpoint;

// Use useLayoutEffect on the client, useEffect on the server (SSR-safe)
const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

// ─── Component ────────────────────────────────────────────────────────────────

/**
 * MasonryGrid
 *
 * A smart, responsive masonry layout component.
 *
 * @example
 * ```tsx
 * <MasonryGrid columns={{ 0: 1, 640: 2, 1024: 3 }} gap="20px">
 *   {items.map((item) => (
 *     <MyCard key={item.id} {...item} />
 *   ))}
 * </MasonryGrid>
 * ```
 */
export function MasonryGrid({
  children,
  columns = { 0: 1, 640: 2, 1280: 3 },
  gap = "16px",
  className,
  style,
  onColumnsChange,
}: MasonryGridProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<number, HTMLDivElement>>(new Map());

  const [columnCount, setColumnCount] = useState<number>(() => {
    if (typeof columns === "number") return columns;
    // SSR-safe: default to smallest breakpoint value
    const sorted = Object.keys(columns)
      .map(Number)
      .sort((a, b) => a - b);
    return columns[sorted[0]] ?? 1;
  });

  const [itemHeights, setItemHeights] = useState<number[]>([]);

  const childArray = useMemo(() => Children.toArray(children), [children]);

  // ── Measure item heights ──────────────────────────────────────────────────

  const measureHeights = useCallback(() => {
    const next: number[] = [];
    for (let i = 0; i < childArray.length; i++) {
      const el = itemRefs.current.get(i);
      next.push(el ? el.getBoundingClientRect().height : 0);
    }
    setItemHeights(next);
  }, [childArray.length]);

  // ── Resolve column count from container width ─────────────────────────────

  const updateColumns = useCallback(() => {
    if (!wrapperRef.current) return;
    const width = wrapperRef.current.offsetWidth;
    const next =
      typeof columns === "number"
        ? Math.max(1, columns)
        : resolveColumns(columns, width);

    setColumnCount((prev) => {
      if (prev !== next) onColumnsChange?.(next);
      return next;
    });
  }, [columns, onColumnsChange]);

  // ── ResizeObserver – watch container width ────────────────────────────────

  useIsomorphicLayoutEffect(() => {
    updateColumns();
    measureHeights();

    const ro = new ResizeObserver(() => {
      updateColumns();
      measureHeights();
    });

    if (wrapperRef.current) ro.observe(wrapperRef.current);
    return () => ro.disconnect();
  }, [updateColumns, measureHeights]);

  // Re-measure when children change
  useIsomorphicLayoutEffect(() => {
    measureHeights();
  }, [childArray.length, measureHeights]);

  // ── Distribute children into columns ─────────────────────────────────────

  const columnIndices = useMemo(
    () => distributeChildren(childArray.length, columnCount, itemHeights),
    [childArray.length, columnCount, itemHeights],
  );

  // ── Column width ──────────────────────────────────────────────────────────
  const colWidthStyle = `calc((100% - ${gap} * ${columnCount - 1}) / ${columnCount})`;

  return (
    columnIndices.length > 0 && (
      <div
        ref={wrapperRef}
        className={className}
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "flex-start",
          gap,
          width: "100%",
          boxSizing: "border-box",
          ...style,
        }}
      >
        {columnIndices.map((indices, colIdx) => (
          <div
            key={colIdx}
            style={{
              display: "flex",
              flexDirection: "column",
              gap,
              width: colWidthStyle,
              flexShrink: 0,
              flexGrow: 0,
            }}
          >
            {indices.map((childIdx) => (
              <div
                key={childIdx}
                ref={(el) => {
                  if (el) itemRefs.current.set(childIdx, el);
                  else itemRefs.current.delete(childIdx);
                }}
              >
                {childArray[childIdx]}
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  );
}

export default MasonryGrid;
