import type {
  CallArgument,
  CodeModel,
  ExpressionToken,
  NativeExpressionModel,
  ExpressionSymbol,
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
  "[1]",
  "0",
  "",
  "[",
  "]",
  "[]",
]);

/** JS/TS keywords that should never appear as generic variable tokens. */
const JS_KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "function",
  "if",
  "else",
  "for",
  "while",
  "do",
  "return",
  "switch",
  "case",
  "break",
  "continue",
  "new",
  "typeof",
  "instanceof",
  "try",
  "catch",
  "finally",
  "throw",
  "class",
  "extends",
  "import",
  "export",
  "default",
  "true",
  "false",
  "null",
  "undefined",
  "this",
  "of",
  "in",
  "void",
  "delete",
  "yield",
  "await",
  "async",
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
  const lines = before.split("\n");
  return { line: lines.length, column: lines[lines.length - 1]?.length ?? 0 };
}

/**
 * Split a raw argument string on top-level commas, correctly ignoring
 * commas inside nested parentheses or brackets.
 */
function splitTopLevelArgs(raw: string): string[] {
  const result: string[] = [];
  let depth = 0;
  let current = "";
  for (const ch of raw) {
    if (ch === "(" || ch === "[") {
      depth++;
      current += ch;
    } else if (ch === ")" || ch === "]") {
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

/**
 * Given a string and a position pointing at an opening '(', return the index
 * of the matching closing ')'. Returns -1 if not found.
 */
function findMatchingParen(text: string, openIndex: number): number {
  let depth = 0;
  for (let i = openIndex; i < text.length; i++) {
    if (text[i] === "(") depth++;
    else if (text[i] === ")") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
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
 * return a structured `ExpressionSymbol` ready to be attached to the API response.
 */
export function parseAeExpression(
  code: CodeModel,
  nativeExpressions: NativeExpressionModel[],
): ExpressionSymbol {
  const text = code.lines.map((l) => l.content).join("\n");
  const allTokens: ExpressionToken[] = [];
  const occupied = new RangeSet();

  // Mark comment ranges as occupied so neither pass tokenizes inside them.
  const commentRe = /\/\/[^\n]*|\/\*[\s\S]*?\*\//g;
  for (const m of text.matchAll(commentRe)) {
    occupied.add(m.index!, m.index! + m[0].length);
  }

  // Single monotonic counter — every token AND every CallArgument gets a
  // unique id drawn from this sequence. No two objects in the output share
  // the same id.
  const nextId: () => string = () => crypto.randomUUID() as unknown as string;

  // ── Pass 1: native expression matches ──────────────────────────────────────

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

      const tokenId = nextId();
      const hasParens = fullMatch.includes("(");

      // Raw named groups from the regex (includes undefined entries for
      // optional groups that didn't participate in this match).
      const rawGroups = match.groups ?? {};

      // captureGroups exposed on the token: only defined values.
      const captureGroups: Record<string, string> | undefined =
        Object.keys(rawGroups).length > 0
          ? (Object.fromEntries(
              Object.entries(rawGroups).filter(([, v]) => v !== undefined),
            ) as Record<string, string>)
          : undefined;

      // Build callArguments by matching paramNames to group values by NAME,
      // not by insertion order. Each argument gets its own unique id.
      const callArguments: CallArgument[] = paramNames.flatMap(
        (name): CallArgument[] => {
          const value = rawGroups[name];
          if (value === undefined) return [];
          return [{ id: nextId(), name, value }];
        },
      );

      // Fallback for natives with no named groups but with a first capture.
      if (callArguments.length === 0 && match[1] !== undefined) {
        splitTopLevelArgs(match[1]).forEach((value, i) => {
          callArguments.push({ id: nextId(), name: paramNames[i], value });
        });
      }

      const kind: TokenKind = hasParens
        ? "function"
        : native.title.includes(".")
          ? "method"
          : "property";

      const { line, column } = indexToPosition(text, index);

      allTokens.push({
        id: tokenId,
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
  }

  // ── Pass 2: generic identifiers not covered by any native match ────────────
  //
  // We use a simple identifier regex, then do balanced-paren scanning
  // manually for the argument list. This correctly handles nested calls
  // like foo(bar(1), 2) which a character-class regex cannot.

  const identRe = /[a-zA-Z_$][\w$."]*/g;

  for (const match of text.matchAll(identRe)) {
    const index = match.index ?? 0;
    const title = match[0];

    if (NOISE_TOKENS.has(title) || /^\d+$/.test(title)) continue;

    // Emit keywords as their own token with kind "keyword"
    if (JS_KEYWORDS.has(title)) {
      const identEnd = index + title.length;
      if (occupied.overlaps(index, identEnd)) continue;
      occupied.add(index, identEnd);
      const { line, column } = indexToPosition(text, index);
      allTokens.push({
        id: nextId(),
        label: title,
        fullMatch: title,
        title,
        isNative: false,
        kind: "keyword",
        lookingGlass: buildLookingGlass(text, index, title.length),
        index,
        line,
        column,
      });
      continue;
    }

    // Check if the identifier itself is already claimed.
    const identEnd = index + title.length;
    if (occupied.overlaps(index, identEnd)) continue;

    // Check whether a '(' immediately follows the identifier.
    const parenStart = identEnd;
    const hasParens = parenStart < text.length && text[parenStart] === "(";

    let fullMatch = title;
    let rawArgs = "";
    let end = identEnd;

    if (hasParens) {
      const closeIndex = findMatchingParen(text, parenStart);
      if (closeIndex !== -1) {
        end = closeIndex + 1;
        fullMatch = text.slice(index, end);
        rawArgs = text.slice(parenStart + 1, closeIndex);
      } else {
        // Unmatched paren — treat as plain identifier.
        end = identEnd;
        fullMatch = title;
      }
    }

    // Re-check now that we know the full extent of the token.
    if (occupied.overlaps(index, end)) continue;
    occupied.add(index, end);

    const tokenId = nextId();

    const callArguments: CallArgument[] | undefined = hasParens
      ? splitTopLevelArgs(rawArgs)
          .filter((value) => value !== "")
          .map((value) => ({ id: nextId(), value }))
      : undefined;

    const kind = classifyGenericToken(title, hasParens && end > identEnd);
    const { line, column } = indexToPosition(text, index);

    allTokens.push({
      id: tokenId,
      label: hasParens ? `${title}()` : title,
      fullMatch,
      title,
      isNative: false,
      kind,
      callArguments,
      lookingGlass: buildLookingGlass(text, index, fullMatch.length),
      index,
      line,
      column,
    });
  }

  // ── Sort by source position and group ─────────────────────────────────────
  allTokens.sort((a, b) => a.index - b.index);

  return {
    id: nextId(),
    text,
    tokens: allTokens,
    groups: {
      functions: allTokens.filter((t) => t.kind === "function"),
      methods: allTokens.filter((t) => t.kind === "method"),
      properties: allTokens.filter((t) => t.kind === "property"),
      variables: allTokens.filter((t) => t.kind === "variable"),
      keywords: allTokens.filter((t) => t.kind === "keyword"),
      unknown: allTokens.filter((t) => t.kind === "unknown"),
    },
  };
}
