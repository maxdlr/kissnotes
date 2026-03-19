import ExpressionEntity from "@/entities/ExpressionEntity";
import { ExpressionToken } from "@kissnotes/types";

/**
 * Filters expressions where every token title in the list
 * is present in expression.symbols.tokens.
 */
const filterByTokens = (
  collection: ExpressionEntity[],
  tokenTitles: string[],
): ExpressionEntity[] => {
  return collection.filter((expression) =>
    tokenTitles.every((title) =>
      expression.symbols?.tokens.some(
        (t: ExpressionToken) => String(t.title) === title,
      ),
    ),
  );
};

export default filterByTokens;
