import type {
  CallArgument,
  CodeModel,
  ExpressionToken,
  NativeExpressionModel,
  ParsedExpression,
  TokenKind,
} from "@kissnotes/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const NOISE_TOKENS = new Set([
  "(",
  ")",
  ".",
  "/",
  "\\",
  "[0]",
  "0",
  "",
  "[",
  "]",
  "[]",
]);

/** Build a ~40-char context window centred on the match. */
function buildLookingGlass(
  text: string,
  index: number,
  matchLen: number,
  radius = 20,
): string {
  const centre = Math.floor(index + matchLen / 2);
  const start = Math.max(0, centre - radius);
  const end = Math.min(text.length, centre + radius);
  return (
    (start > 0 ? "…" : "") +
    text.slice(start, end) +
    (end < text.length ? "…" : "")
  );
}

/** Convert a flat character index to 1-based line + 0-based column. */
function indexToPosition(
  text: string,
  index: number,
): { line: number; column: number } {
  const before = text.slice(0, index);
  const lines = before.split("\n") || [];
  return { line: lines.length, column: lines[lines.length - 1]?.length ?? 0 };
}

/**
 * Split a raw argument string on top-level commas, correctly ignoring
 * commas inside nested parentheses.
 */
function splitTopLevelArgs(raw: string): string[] {
  const result: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of raw) {
    if (ch === "(") {
      depth++;
      current += ch;
    } else if (ch === ")") {
      depth--;
      current += ch;
    } else if (ch === "," && depth === 0) {
      result.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim()) result.push(current.trim());
  return result;
}

/** Classify a token that was not matched by any native expression. */
function classifyGenericToken(title: string, hasParens: boolean): TokenKind {
  if (hasParens) return "function";
  if (title.includes(".")) return "method";
  if (/^[A-Z]/.test(title)) return "property";
  return "variable";
}

/**
 * Tracks occupied source ranges so the generic pass never re-tokenises
 * content already claimed by a native match.
 */
class RangeSet {
  private ranges: Array<[number, number]> = [];

  add(start: number, end: number) {
    this.ranges.push([start, end]);
  }

  overlaps(start: number, end: number): boolean {
    return this.ranges.some(([s, e]) => start < e && end > s);
  }
}

// ─── Core parser ──────────────────────────────────────────────────────────────

/**
 * Parse an AE expression against the full native-expression dictionary and
 * return a structured `ParsedExpression` ready to be attached to the API response.
 */
export function parseAeExpression(
  code: CodeModel,
  nativeExpressions: NativeExpressionModel[],
): ParsedExpression {
  const text = code.lines.map((l) => l.content).join("\n");
  const allTokens: ExpressionToken[] = [];
  const occupied = new RangeSet();

  // ── Pass 1: native expression matches ──────────────────────────────────────
  let id = 0;
  for (const native of nativeExpressions) {
    let regex: RegExp;
    try {
      regex = new RegExp(native.regex, "g");
    } catch {
      continue; // malformed stored regex — skip gracefully
    }

    const paramNames: string[] = native.arguments
      ? native.arguments
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean)
      : [];

    for (const match of text.matchAll(regex)) {
      const index = match.index ?? 0;
      const fullMatch = match[0];
      const end = index + fullMatch.length;

      if (occupied.overlaps(index, end)) continue;
      occupied.add(index, end);

      const hasParens = fullMatch.includes("(");

      // Named capture groups — zip against paramNames by insertion order
      const captureGroups: Record<string, string> | undefined = match.groups
        ? (Object.fromEntries(
            Object.entries(match.groups).filter(([, v]) => v !== undefined),
          ) as Record<string, string>)
        : undefined;

      const callArguments: CallArgument[] = captureGroups
        ? Object.entries(captureGroups).map(([groupName, value], i) => ({
            id,
            name: paramNames[i] ?? groupName,
            value,
          }))
        : [];

      // Fallback: no named groups but positional capture available
      if (!callArguments.length && match[1]) {
        splitTopLevelArgs(match[1]).forEach((value, i) => {
          callArguments.push({ id, name: paramNames[i], value });
        });
      }

      const kind: TokenKind = hasParens
        ? "function"
        : native.title.includes(".")
          ? "method"
          : "property";

      const { line, column } = indexToPosition(text, index);

      allTokens.push({
        id,
        label: hasParens ? `${native.title}()` : native.title,
        fullMatch,
        title: native.title,
        description: native.description,
        isNative: true,
        kind,
        callArguments: callArguments.length ? callArguments : undefined,
        paramNames: paramNames.length ? paramNames : undefined,
        lookingGlass: buildLookingGlass(text, index, fullMatch.length),
        index,
        line,
        column,
        captureGroups,
      });
    }
    id++;
  }

  // ── Pass 2: generic identifiers not covered by any native match ────────────
  const genericRe = /([a-zA-Z_$][\w$.]*)(\(([^)]*)\))?/g;

  for (const match of text.matchAll(genericRe)) {
    const index = match.index ?? 0;
    const fullMatch = match[0];
    const end = index + fullMatch.length;

    if (occupied.overlaps(index, end)) continue;

    const title = match[1] || "";
    const hasParens = !!match[2];
    const rawArgs = match[3] ?? "";

    if (NOISE_TOKENS.has(title) || /^\d+$/.test(title)) continue;

    occupied.add(index, end);

    const callArguments: CallArgument[] | undefined = hasParens
      ? splitTopLevelArgs(rawArgs)
          .map((value) => ({ value, id }))
          .filter((a) => a.value !== "")
      : undefined;

    const kind = classifyGenericToken(title, hasParens);
    const { line, column } = indexToPosition(text, index);

    allTokens.push({
      id,
      label: hasParens ? `${title}()` : title,
      fullMatch: fullMatch.trim(),
      title,
      isNative: false,
      kind,
      callArguments,
      lookingGlass: buildLookingGlass(text, index, fullMatch.length),
      index,
      line,
      column,
    });
    id++;
  }

  // ── Sort by source position and group ─────────────────────────────────────
  allTokens.sort((a, b) => a.index - b.index);

  return {
    text,
    tokens: allTokens,
    groups: {
      functions: allTokens.filter((t) => t.kind === "function"),
      methods: allTokens.filter((t) => t.kind === "method"),
      properties: allTokens.filter((t) => t.kind === "property"),
      variables: allTokens.filter((t) => t.kind === "variable"),
      unknown: allTokens.filter((t) => t.kind === "unknown"),
    },
  };
}
