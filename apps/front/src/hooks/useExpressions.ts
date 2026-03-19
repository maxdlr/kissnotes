import type {
  ExpressionModel,
  ExpressionSymbol,
  ExpressionToken,
} from "@kissnotes/types";
import { arrayUnique } from "@/utils/arrayUtils";

const useExpressions = (expressions: ExpressionModel[]) => {
  const getTokens = (
    kinds?: (keyof ExpressionSymbol["groups"])[],
    property?: keyof ExpressionToken,
  ) => {
    if (!expressions.length) {
      return [];
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

    return arrayUnique<ExpressionToken>(
      symbols.flatMap((s): ExpressionToken[] => s.tokens),
      property || "label",
    );
  };

  return {
    getTokens,
  };
};

export default useExpressions;
