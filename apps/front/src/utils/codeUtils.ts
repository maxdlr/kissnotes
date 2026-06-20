import type { CodeModel } from "@kissnotes/types";

export const toCodeModel = (raw: string): CodeModel => ({
  lines: raw.split("\n").map((content, i) => ({ number: i + 1, content })),
});

export const toRawCodeString = (code: CodeModel): string =>
  code.lines.map((line) => line.content).join("\n");
