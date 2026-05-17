const baseZIndex = 0;
let currentMax = baseZIndex;

/**
 * Scans the DOM to find the highest z-index currently in use.
 * Works with Tailwind z-* classes and inline style z-index.
 */
export const getNextZIndex = (): number => {
  if (typeof window === "undefined") {
    return currentMax;
  }
  const allElements = Array.from(
    document.querySelectorAll<HTMLElement>("body *"),
  );
  const zIndices = allElements.map((el): number | null => {
    const computed = window.getComputedStyle(el).zIndex;
    let z = parseInt(computed, 10);

    // Fallback: detect Tailwind-like z-* classes
    if (Number.isNaN(z)) {
      const match = Array.from(el.classList).find((cls) =>
        /^z-(\[\d+\]|\d+)$/.test(cls),
      );
      if (match) {
        const num = match.match(/\d+/);
        if (num) z = parseInt(num[0], 10);
      }
    }

    return Number.isNaN(z) ? null : z;
  });

  const validZIndices = zIndices.filter((z): z is number => z !== null);
  const maxInDom = Math.max(baseZIndex, ...validZIndices);
  currentMax = Math.max(currentMax, maxInDom);
  currentMax += 1;
  return currentMax;
};
