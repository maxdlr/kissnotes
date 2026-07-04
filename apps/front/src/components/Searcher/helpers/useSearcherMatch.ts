import { truncate } from "@/utils/stringUtils";
import { ExpressionModel, LineModel } from "@kissnotes/types";

const getKeywords = (searchPrompt?: string): string[] => {
  if (!searchPrompt || searchPrompt.trim().length === 0) {
    return [];
  }
  const keywords = searchPrompt
    .split(/\s+/)
    .map((keyword) => keyword.trim())
    .filter((keyword) => keyword.length > 0);

  return keywords;
};

const getLineMatches = (
  expression: ExpressionModel,
  searchPrompt?: string,
): { lines: LineModel[]; hasMatch: boolean } => {
  const lineMatch: LineModel | undefined = searchPrompt
    ? expression.code?.lines?.find((line: LineModel) =>
        getKeywords(searchPrompt).some((keyword) =>
          line.content.toLowerCase().includes(keyword.toLowerCase()),
        ),
      )
    : undefined;

  const lineNumber = lineMatch ? lineMatch.number : null;
  const prevLineNumber = lineMatch ? lineMatch.number - 1 : null;
  const nextLineNumber = lineMatch ? lineMatch.number + 1 : null;

  const lines = lineMatch
    ? expression.code.lines.filter((line: LineModel) =>
        [lineNumber, prevLineNumber, nextLineNumber].includes(line.number),
      )
    : expression.code?.lines.slice(0, 3);

  return { lines, hasMatch: !!lineMatch };
};

const getDescriptionMatch = (
  description: ExpressionModel["description"],
  searchPrompt?: string,
): ExpressionModel["description"] => {
  const index =
    searchPrompt && description
      ? description.toLowerCase().indexOf(searchPrompt.toLowerCase())
      : -1;

  return index !== -1 && description && searchPrompt
    ? description.slice(
        Math.max(index - 30, 0),
        Math.min(index + searchPrompt.length + 30, description.length),
      )
    : description
      ? truncate(description, 60)
      : undefined;
};

const getTitleMatch = (
  title: ExpressionModel["title"],
  searchPrompt?: string,
): ExpressionModel["title"] => {
  const index =
    searchPrompt && title
      ? title.toLowerCase().indexOf(searchPrompt.toLowerCase())
      : -1;

  const result =
    index !== -1 && title && searchPrompt
      ? title.slice(
          Math.max(index - 20, 0),
          Math.min(index + searchPrompt.length + 20, title.length),
        )
      : title
        ? truncate(title, 40)
        : undefined;

  return result || "";
};

const useSearcherMatch = () => {
  return { getLineMatches, getDescriptionMatch, getTitleMatch, getKeywords };
};
export default useSearcherMatch;
