import ExpressionEntity from "@/entities/ExpressionEntity";
import Fuse from "fuse.js";

/**
 * Filters expressions where the search term matches (case-insensitive) any of:
 * - expression.title
 * - expression.description
 * - any line's content in expression.code.lines
 */
const filterExpressionBySearch = (
  collection: ExpressionEntity[],
  search: string,
): ExpressionEntity[] => {
  const fuse = new Fuse(collection, {
    includeScore: true,
    keys: [
      { name: "code.lines.content", weight: 0.4 },
      { name: "symbols.tokens.labels", weight: 0.3 },
      { name: "title", weight: 0.4 },
      { name: "author.username", weight: 0.2 },
      { name: "description", weight: 0.1 },
    ],
  });

  const results = fuse
    .search(search)
    .filter((s) => s.score! <= 0.5)
    .sort((a, b) => a.score! - b.score!)
    .map((result) => result.item);

  return results;
};

export default filterExpressionBySearch;
