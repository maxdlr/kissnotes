import type {
  ExpressionModel,
  ExpressionSymbol,
  ExpressionToken,
} from "@kissnotes/types";
import { arrayUnique } from "@/utils/arrayUtils";
import { useMemo, useCallback } from "react";

const useExpressions = (expressions?: ExpressionModel[] | ExpressionModel) => {
  const getTokens = useCallback(
    (
      kinds?: (keyof ExpressionSymbol["groups"])[],
      property?: keyof ExpressionToken,
    ): ExpressionToken[] => {
      if (!expressions) return [];

      if (!Array.isArray(expressions)) {
        if (kinds) {
          return arrayUnique(
            kinds.flatMap((k) => expressions.symbols?.groups?.[k] || []),
            property || "label",
          );
        }

        return arrayUnique<ExpressionToken>(
          (expressions.symbols?.tokens as ExpressionToken[]) || [],
          property || "label",
        );
      }

      const symbols = expressions
        .map((e) => e.symbols)
        .filter((s): s is ExpressionSymbol => s !== undefined);

      if (kinds) {
        return arrayUnique(
          kinds.flatMap((k) => symbols.flatMap((s) => s.groups[k])),
          property || "label",
        );
      }

      return arrayUnique<ExpressionToken>(
        symbols.flatMap((s) => s.tokens as ExpressionToken[]),
        property || "label",
      );
    },
    [expressions],
  );

  const tokens = useMemo(() => getTokens(), [getTokens]);

  return { getTokens, tokens };
};

export default useExpressions;
