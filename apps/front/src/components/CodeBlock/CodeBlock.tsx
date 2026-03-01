import { ClipboardIcon } from "@heroicons/react/24/outline";
import type { CodeModel } from "@kissnotes/types";

interface CodeBlockProps {
  code: CodeModel;
  className: string;
}
const CodeBlock = ({ code, className }: CodeBlockProps) => {
  return (
    <div className={className}>
      <div className="bg-code p-4 rounded-2xl flex flex-col justify-start items-end">
        <ClipboardIcon className="size-6" />
        <div className="w-full">
          {code.lines.map(({ number, content }) => (
            <p key={number} className="flex justify-start items-baseline gap-4">
              <span className="text-accent">{number}</span>
              <span>{content}</span>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CodeBlock;
