import { Button } from "@/components/Button";
import { CheckBadgeIcon } from "@heroicons/react/16/solid";
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
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
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1000);
  };

  return (
    <button
      type="button"
      className="block cursor-text
      hover:scale-101 active:scale-99 
      origin-center transition-all 
      leading-none select-text
      w-full
      group"
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
group-hover:border-emphasis/50 
group-active:border-emphasis/80 
group-hover:border 
px-2 py-1 rounded-md flex-1 whitespace-pre text-sm ${lineContentClassName}`}
        >
          <CodeBlock.LineContent className="flex items-center gap-2">
            <div>{children}</div>
          </CodeBlock.LineContent>
        </div>
        <div
          className={`group-hover:bg-code select-none sticky right-0 ps-2 py-2 h-full w-fit z-10 group-hover:active-101 group-hover:scale-99`}
        >
          {!copied ? (
            <ClipboardIcon className="hidden group-hover:block size-4" />
          ) : (
            <CheckBadgeIcon className="hidden group-hover:block size-4" />
          )}
        </div>
      </div>
    </button>
  );
};

export default KissLineContent;
