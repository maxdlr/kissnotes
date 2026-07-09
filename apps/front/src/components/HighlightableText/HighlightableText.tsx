import { HighlightableTextProps } from "./interfaces";

const HighlightableText = ({
  text,
  highlightedTexts,
  className,
}: HighlightableTextProps) => {
  const matches = highlightedTexts?.filter(Boolean);
  if (!matches || matches.length === 0) {
    return text;
  }

  const escaped = matches.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const regex = new RegExp(`(${escaped.join("|")})`, "gi");
  const parts = text.split(regex);

  const testRegex = new RegExp(`^(${escaped.join("|")})$`, "i");

  return (
    <>
      {parts.map((part, i) =>
        testRegex.test(part) ? (
          <mark
            key={i}
            className={`bg-emphasis/30 text-emphasis font-bold px-1 rounded-3xl ${className}`}
          >
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
};
export default HighlightableText;
