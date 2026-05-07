import type {
  ExpressionModel,
  ExpressionSymbol,
  ExpressionToken,
} from "@kissnotes/types";
import { arrayUnique } from "@/utils/arrayUtils";

const useExpressions = (expressions?: ExpressionModel[] | ExpressionModel) => {
  const getTokens = (
    kinds?: (keyof ExpressionSymbol["groups"])[],
    property?: keyof ExpressionToken,
  ): ExpressionToken[] => {
    if (!expressions) return [];

    if (!Array.isArray(expressions)) {
      if (kinds) {
        return arrayUnique(
          kinds.flatMap((k) => expressions.symbols?.groups[k] || []),
          property || "label",
        );
      }

      return arrayUnique<ExpressionToken>(
        (expressions.symbols?.tokens as ExpressionToken[]) || [],
        property || "label",
      );
    }
    const symbols = expressions
      .map((expression: ExpressionModel) => expression.symbols)
      .filter((symbol): symbol is ExpressionSymbol => symbol !== undefined);

    if (kinds) {
      return arrayUnique(
        kinds.flatMap((k) => symbols.flatMap((s) => s.groups[k])),
        property || "label",
      );
    }

    return (
      arrayUnique<ExpressionToken>(
        symbols.flatMap(
          (s): ExpressionToken[] => s.tokens as ExpressionToken[],
        ),
        property || "label",
      ) || []
    );
  };

  return {
    getTokens,
  };
};

export default useExpressions;
