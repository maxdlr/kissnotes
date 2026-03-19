import ExpressionEntity from "@/entities/ExpressionEntity";

/**
 * Filters expressions where the search term matches (case-insensitive) any of:
 * - expression.title
 * - expression.description
 * - any line's content in expression.code.lines
 */
const filterBySearch = (
  collection: ExpressionEntity[],
  search: string,
): ExpressionEntity[] => {
  const term = search.toLowerCase();

  return collection.filter((expression) => {
    const inTitle = expression.title?.toLowerCase().includes(term);

    const inDescription = expression.description?.toLowerCase().includes(term);

    const inCode = expression.code?.lines?.some((line) =>
      line.content?.toLowerCase().includes(term),
    );

    return inTitle || inDescription || inCode;
  });
};

export default filterBySearch;
