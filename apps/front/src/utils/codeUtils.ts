import type { CodeModel } from "@kissnotes/types";

export const toCodeModel = (raw: string): CodeModel => ({
  lines: raw.split("\n").map((content, i) => ({ number: i + 1, content })),
});
