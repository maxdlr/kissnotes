import type { CodeModel, NativeExpressionModel } from "@kissnotes/types";
import { useEffect, useState } from "react";
import useBrowse from "@/hooks/bread/useBrowse";

const useAeExpressions = (code: CodeModel, regexes?: string[]) => {
  const { data: nativeExpressions, isLoading } =
    useBrowse<NativeExpressionModel[]>("native-expressions");
  const text = code.lines.map((l) => l.content).join("\n");

  const [matches, setMatches] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let regexMatches!: (RegExpMatchArray | null)[] | undefined;
    if (regexes) {
      regexMatches;
    } else {
      regexMatches = nativeExpressions?.map(
        (nativeExp: NativeExpressionModel) => text.match(nativeExp.regex),
      );
    }

    const matchArray = (
      regexMatches?.reduce((acc: string[], match: RegExpMatchArray | null) => {
        if (match) {
          const mainMatch = match[0];
          const argNames = match.groups ? Object.keys(match.groups) : [];
          const args = match[1];
          const emptyFn = mainMatch.split(args);
          const array = [
            // mainMatch,
            argNames.join(""),
            args,
            emptyFn.join(""),
          ].flat();
          array.forEach((m) => {
            acc.push(m);
          });
          // acc = [args];
        }

        return acc;
      }, [] as string[]) || []
    ).flatMap((snippet) => snippet.split("."));

    const filtered = matchArray.filter(
      (m) =>
        !["(", ")", ".", "/", "\\", "[0]", "0", "", "[", "]", "[]"].includes(m),
    );

    const split = filtered.flatMap((f) => f.split("."));

    setMatches(split);
    setLoading(false);
  }, [nativeExpressions, text, regexes]);

  return { text, matches, isLoading: loading && isLoading };
};

export default useAeExpressions;
