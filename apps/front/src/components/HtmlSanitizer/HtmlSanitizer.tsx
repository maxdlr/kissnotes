import sanitizeHtml from "@/utils/stringUtils";
import type { HtmlSanitizerProps } from "./interfaces";

const HtmlSanitizer = ({
  html = "",
  Tag = "div",
  className = "",
  ...props
}: HtmlSanitizerProps) => {
  return (
    <Tag
      className={className}
      {...props}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
};

export default HtmlSanitizer;
