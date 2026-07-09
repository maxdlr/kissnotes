/** biome-ignore-all lint/suspicious/noArrayIndexKey: dontcare */
"use client";

import { motion, useIsomorphicLayoutEffect } from "motion/react";
import { Children, useCallback, useMemo, useRef, useState } from "react";
import { resolveColumns, distributeChildren } from "./helpers";
import { MasonryGridProps } from "./interfaces";

/**
 * MasonryGrid
 *
 * A smart, responsive masonry layout component.
 *
 * @example
 * ```tsx
 * <MasonryGrid columns={{ 0: 1, 640: 2, 1280: 3 }} gap="20px">
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
  stagger = false,
  staggerDelay = 0.06,
  staggerDistance = 30,
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
              <motion.div
                key={childIdx}
                ref={(el) => {
                  if (el) itemRefs.current.set(childIdx, el);
                  else itemRefs.current.delete(childIdx);
                }}
                {...(stagger
                  ? {
                      initial: { opacity: 0, y: staggerDistance },
                      animate: { opacity: 1, y: 0 },
                      transition: {
                        type: "spring",
                        bounce: 0.5,
                        delay: childIdx * staggerDelay,
                      },
                    }
                  : {})}
              >
                {childArray[childIdx]}
              </motion.div>
            ))}
          </div>
        ))}
      </div>
    )
  );
}

export default MasonryGrid;
