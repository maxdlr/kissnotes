interface HighlightableTextProps {
  text: string;
  highlightedText?: string;
  className?: string;
}

const HighlightableText = ({
  text,
  highlightedText,
  className,
}: HighlightableTextProps) => {
  return highlightedText && text?.includes(highlightedText) ? (
    <>
      ...
      {text.split(highlightedText).map((part, i, arr) => (
        <span key={i}>
          {part}
          {i < arr.length - 1 && (
            <mark
              className={`bg-emphasis/30 text-emphasis font-bold px-1 rounded-3xl ${className}`}
            >
              {highlightedText}
            </mark>
          )}
        </span>
      ))}
      ...
    </>
  ) : (
    text
  );
};
export default HighlightableText;
