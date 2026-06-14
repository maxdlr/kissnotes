import type { ElementType, HTMLAttributes } from "react";

export interface HtmlSanitizerProps extends HTMLAttributes<HTMLElement> {
  /** Raw HTML string to sanitize and render. */
  html?: string;
  /** HTML element or component to render as. */
  Tag?: ElementType;
  /** Additional CSS classes. */
  className?: string;
}
