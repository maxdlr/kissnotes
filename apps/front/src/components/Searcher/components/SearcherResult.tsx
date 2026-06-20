import Collapsible from "@/components/Collapsible";
import KissCodeBlock from "@/components/KissCodeBlock";
import HighlightableText from "@/components/Loading/HighlightableText/HighlightableText";
import UserHandle from "@/components/UserHandle";
import useDebounce from "@/hooks/useDebounce";
import { useShortcut } from "@/hooks/useShortcut";
import { truncate } from "@/utils/stringUtils";
import { ArrowDownIcon } from "@heroicons/react/24/outline";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { ExpressionModel, Id, LineModel } from "@kissnotes/types";
import { useMemo } from "react";

const SearchResult = ({
  expression,
  searchPrompt,
  selected = false,
  onSelect,
}: {
  expression: ExpressionModel;
  searchPrompt?: string;
  selected?: boolean;
  onSelect?: (id: Id) => void;
}) => {
  useShortcut({ keys: ["enter"], ignoreInputs: false }, (e) => {
    e.preventDefault();
    onSelect?.(expression.id);
  });

  const localSearchPrompt = useDebounce(searchPrompt, 300);
  const result = useMemo((): {
    hasMatch: boolean;
    expression: ExpressionModel;
  } => {
    if (!localSearchPrompt) {
      return { hasMatch: false, expression };
    }

    const lineMatch: LineModel | undefined = expression.code.lines.find(
      (line: LineModel) => line.content.includes(localSearchPrompt),
    );

    const lineNumber = lineMatch ? lineMatch.number : null;
    const prevLineNumber = lineMatch ? lineMatch.number - 1 : null;
    const nextLineNumber = lineMatch ? lineMatch.number + 1 : null;

    const lines = lineMatch
      ? expression.code.lines.filter((line: LineModel) =>
          [lineNumber, prevLineNumber, nextLineNumber].includes(line.number),
        )
      : expression.code.lines.slice(0, 3);

    const descriptionMatch: string | undefined =
      expression.description?.includes(localSearchPrompt)
        ? expression.description
        : undefined;

    const description =
      descriptionMatch && expression.description
        ? expression.description?.slice(
            Math.max(expression.description.indexOf(localSearchPrompt) - 50, 0),
            Math.min(
              expression.description.indexOf(localSearchPrompt) + 50,
              expression.description.length,
            ),
          )
        : expression.description
          ? truncate(expression.description, 100)
          : undefined;

    return {
      hasMatch: !!lineMatch,
      expression: {
        ...expression,
        description,
        code: {
          lines,
        },
      },
    };
  }, [expression, localSearchPrompt]);

  return (
    <div
      className={`relative border ${selected ? "border-emphasis" : "border-accent"} rounded-3xl py-4 px-6 space-y-6`}
    >
      {selected && (
        <div className="absolute left-0 top-8 z-50 -translate-x-1/2 flex flex-col gap-2">
          {[ArrowUpIcon, ArrowDownIcon].map((Icon, index) => (
            <div
              key={index}
              className="bg-dark flex items-center justify-center p-1 border border-emphasis rounded-md"
            >
              <Icon className="size-4 text-emphasis" />
            </div>
          ))}
        </div>
      )}
      <div className="flex items-center justify-between">
        <p className="font-bold">
          <HighlightableText
            text={result.expression.title || ""}
            highlightedText={localSearchPrompt}
          />
        </p>
        <UserHandle username={expression.author.username} />
      </div>
      <div>
        <p>
          <HighlightableText
            text={result.expression.description || ""}
            highlightedText={localSearchPrompt}
          />
        </p>
      </div>
      <Collapsible
        collapsed={
          !(
            (!searchPrompt && result.expression.code.lines.length > 0) ||
            (result.hasMatch && !!searchPrompt)
          )
        }
      >
        <KissCodeBlock
          expression={result.expression}
          highlightedTokens={[searchPrompt || ""]}
        />
      </Collapsible>
    </div>
  );
};
export default SearchResult;
