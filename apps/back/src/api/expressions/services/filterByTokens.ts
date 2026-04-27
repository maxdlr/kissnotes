import ExpressionEntity from "@/entities/ExpressionEntity";

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
      expression.symbols?.tokens.some((t) =>
        typeof t === 'string' ? title === t : title === t.title,
      ),
    ),
  );
};

export default filterByTokens;
