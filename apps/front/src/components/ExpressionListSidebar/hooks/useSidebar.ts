import type {
  ExpressionModel,
  ExpressionSymbol,
  ExpressionToken,
} from "@kissnotes/types";

const useSidebar = (expressionList: ExpressionModel[]) => {
  const getTokens = () => {
    return expressionList
      .map((expression: ExpressionModel) => expression.symbols)
      .filter((symbol): symbol is ExpressionSymbol => symbol !== undefined)
      .flatMap((symbols): ExpressionToken[] => symbols.tokens);
  };

  const getUniqueLabels: ExpressionToken[] =
    (Array.from(new Set(getTokens().map((token) => token.label)))
      .map((label) => getTokens().find((token) => token.label === label))
      .filter((t) => Boolean(t)) as ExpressionToken[]) || [];

  return {
    getTokens,
    getUniqueLabels,
  };
};

export default useSidebar;
