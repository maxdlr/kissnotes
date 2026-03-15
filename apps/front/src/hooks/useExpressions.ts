import type {
  ExpressionModel,
  ExpressionSymbol,
  ExpressionToken,
} from "@kissnotes/types";

const useExpressions = (expressionList: ExpressionModel[]) => {
  const getAllTokens = () => {
    return expressionList
      .map((expression: ExpressionModel) => expression.symbols)
      .filter((symbol): symbol is ExpressionSymbol => symbol !== undefined)
      .flatMap((symbols): ExpressionToken[] => symbols.tokens);
  };

  return {
    getAllTokens,
  };
};

export default useExpressions;
