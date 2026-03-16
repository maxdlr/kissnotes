import type {
  ExpressionModel,
  ExpressionSymbol,
  ExpressionToken,
} from "@kissnotes/types";

const useExpressions = (expressions: ExpressionModel[]) => {
  const getTokens = (kinds?: (keyof ExpressionSymbol["groups"])[]) => {
    if (!expressions.length) {
      return [];
    }
    const symbols = expressions
      .map((expression: ExpressionModel) => expression.symbols)
      .filter((symbol): symbol is ExpressionSymbol => symbol !== undefined);

    if (kinds) {
      return kinds.flatMap((k) => symbols.flatMap((s) => s.groups[k]));
    }

    return symbols.flatMap((s): ExpressionToken[] => s.tokens);
  };

  return {
    getTokens,
  };
};

export default useExpressions;
