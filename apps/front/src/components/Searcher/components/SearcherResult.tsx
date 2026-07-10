import Collapsible from "@/components/Collapsible";
import HighlightableText from "@/components/HighlightableText";
import KissCodeBlock from "@/components/KissCodeBlock";
import Pill from "@/components/Pill";
import UserHandle from "@/components/UserHandle";
import useDebounce from "@/hooks/useDebounce";
import { getRelativeTime } from "@/utils/dateUtils";
import { ArrowDownIcon, EyeIcon } from "@heroicons/react/24/outline";
import { ArrowUpIcon } from "@heroicons/react/24/solid";
import { ExpressionModel, ExpressionToken } from "@kissnotes/types";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo } from "react";
import useSearcherMatch from "../helpers/useSearcherMatch";
import { SearcherResultProps } from "../interfaces";

const SearchResult = ({
  ref,
  expression,
  searchPrompt,
  focused = false,
  onClick,
  native = false,
}: SearcherResultProps) => {
  const localSearchPrompt = useDebounce(searchPrompt?.trim(), 300);
  const { getLineMatches, getDescriptionMatch, getTitleMatch, getKeywords } =
    useSearcherMatch();
  const result = useMemo((): {
    withCodeMatch: boolean;
    expression: ExpressionModel;
  } => {
    const { lines, hasMatch: lineMatch } = getLineMatches(
      expression,
      localSearchPrompt,
    );

    return {
      withCodeMatch: !!lineMatch,
      expression: {
        ...expression,
        title: getTitleMatch(expression.title, localSearchPrompt),
        description: getDescriptionMatch(
          expression.description,
          localSearchPrompt,
        ),
        code: { lines },
      },
    };
  }, [
    expression,
    getDescriptionMatch,
    getLineMatches,
    getTitleMatch,
    localSearchPrompt,
  ]);

  return (
    <motion.div
      ref={ref}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      className={`relative border ${native ? "border-native" : "border-accent"} ${focused ? "outline-1 outline-offset-8 outline-dashed outline-emphasis" : ""} rounded-3xl py-3 px-6 space-y-1 hover:bg-accent/20 cursor-pointer block w-full text-start`}
      onClick={onClick}
    >
      {focused && (
        <div className="absolute -left-1 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-2">
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

      {focused && (
        <div className="absolute top-8 right-8 z-50 -translate-y-1/2 translate-x-1/2 flex flex-col">
          <div className="bg-dark flex items-center justify-center size-8 leading-none border border-emphasis text-emphasis rounded-md">
            ↩
          </div>
        </div>
      )}

      <div className="flex justify-start items-center gap-2">
        {localSearchPrompt &&
        result.expression.author?.username &&
        getKeywords(localSearchPrompt)?.some(
          (k) =>
            k.length >= result.expression.author.username.length / 1.5 &&
            result.expression.author.username
              .toLowerCase()
              .includes(k.toLowerCase()),
        ) ? (
          <UserHandle
            username={expression.author.username}
            className={`${native ? "text-native!" : "text-emphasis!"}`}
          />
        ) : (
          expression.author?.username && (
            <UserHandle username={expression.author.username} />
          )
        )}
        <span className="text-sm text-accent">
          {getRelativeTime(result.expression.createdAt)}
        </span>
        <div className="flex gap-2 items-center justify-center">
          <EyeIcon className="size-4 text-accent" />
          <span className="text-sm text-accent">{result.expression.views}</span>
        </div>
      </div>

      <p className="font-bold">
        <HighlightableText
          text={result.expression.title || ""}
          highlightedTexts={getKeywords(localSearchPrompt)}
        />
      </p>

      <p>
        <HighlightableText
          text={result.expression.description || ""}
          highlightedTexts={getKeywords(localSearchPrompt)}
        />
      </p>

      <AnimatePresence mode="wait">
        {((!getKeywords(localSearchPrompt).length &&
          result.expression.code.lines?.length > 0) ||
          (result.withCodeMatch &&
            !!getKeywords(localSearchPrompt).length)) && (
          <motion.div
            key="code-content"
            initial={{ gridTemplateRows: "0fr", opacity: 0 }}
            animate={{ gridTemplateRows: "1fr", opacity: 1 }}
            exit={{ gridTemplateRows: "0fr", opacity: 0 }}
            className="grid w-full overflow-y-hidden"
          >
            <div className="min-h-0 overflow-x-auto">
              <KissCodeBlock
                condensed
                expression={result.expression}
                highlightedTokens={getKeywords(localSearchPrompt) || []}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <Collapsible
        collapsed={
          !(
            focused ||
            (!!localSearchPrompt &&
              (result.expression.symbols?.tokens as ExpressionToken[])?.some(
                (t: ExpressionToken) => t.label.includes(localSearchPrompt),
              ))
          )
        }
        className="flex justify-start items-center gap-2"
      >
        {((result.expression.symbols?.tokens as ExpressionToken[]) || [])
          .slice(0, 5)
          .map((t: ExpressionToken, i: number) =>
            localSearchPrompt &&
            getKeywords(localSearchPrompt).some((k) =>
              t.label.toLowerCase().includes(k.toLowerCase()),
            ) ? (
              <Pill
                key={`${i}-${t.id}-highlighted`}
                label={t.label}
                isCode
                className="text-emphasis border-emphasis bg-emphasis/10"
              />
            ) : (
              <Pill key={`${i}-${t.id}`} label={t.label} isCode />
            ),
          )}
      </Collapsible>
    </motion.div>
  );
};
export default SearchResult;
