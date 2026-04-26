import { CheckBadgeIcon } from "@heroicons/react/16/solid";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { CodeBlock } from "react-code-block";

interface KissLineContentProps {
  children: React.ReactNode;
  lineContentClassName?: string;
  lineNumberClassName?: string;
  className?: string;
  interactive?: boolean;
}

const KissLineContent = ({
  children,
  className,
  lineContentClassName,
  lineNumberClassName,
  interactive = false,
}: KissLineContentProps) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <button
      type="button"
      className={`block ${interactive ? "group cursor-text hover:scale-99.5 active:scale-98" : ""} origin-center transition-all leading-none select-text`}
      onClick={handleCopy}
    >
      <div className={`flex items-center w-full ${className}`}>
        <div
          className={`group-hover:text-white select-none sticky left-0 bg-code pe-4 py-2 h-full w-fit z-10 ${lineNumberClassName}`}
        >
          <CodeBlock.LineNumber />
        </div>
        <div
          className={`
group-hover:bg-emphasis/10 
group-active:bg-emphasis/20 
group-hover:border-emphasis/50 
group-active:border-emphasis/80 
group-hover:border 
px-2 py-1 rounded-md flex-1 whitespace-pre text-sm ${lineContentClassName}`}
        >
          <CodeBlock.LineContent className="flex items-center gap-2">
            <div>{children}</div>
          </CodeBlock.LineContent>
        </div>
        {interactive && (
          <div
            className={`group-hover:bg-code select-none sticky right-0 ps-2 py-2 h-full w-fit z-10`}
          >
            {!copied ? (
              <ClipboardIcon className="hidden group-hover:block size-4" />
            ) : (
              <CheckBadgeIcon className="hidden group-hover:block size-4" />
            )}
          </div>
        )}
      </div>
    </button>
  );
};

export default KissLineContent;
