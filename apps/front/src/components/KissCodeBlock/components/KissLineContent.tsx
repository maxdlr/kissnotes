import { CodeBlock } from "react-code-block";

interface KissLineContentProps {
  children: React.ReactNode;
  lineContentClassName?: string;
  lineNumberClassName?: string;
  className?: string;
}

const KissLineContent = ({
  children,
  className,
  lineContentClassName,
  lineNumberClassName,
}: KissLineContentProps) => {
  return (
    <div className={`table-row ${className}`}>
      <CodeBlock.LineNumber
        className={`table-cell pe-4 text-sm text-gray-500 text-right select-none ${lineNumberClassName}`}
      />
      <CodeBlock.LineContent className={`text-sm ${lineContentClassName}`}>
        {children}
      </CodeBlock.LineContent>
    </div>
  );
};

export default KissLineContent;
