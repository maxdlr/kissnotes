export const truncate = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) return str;
  return `${str.slice(0, maxLength)}…`;
};

export const asTitle = (str: string): string => {
  if (!str || str.length === 0) return "";
  const capitalized = str.at(0)?.toUpperCase();
  const rest = str.slice(1, str.length);

  return `${capitalized}${rest}`;
};

const sanitizeHtml = (htmlString: string) => {
  if (typeof window === "undefined") return htmlString;

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const dangerousTags = [
    "script",
    "iframe",
    "object",
    "embed",
    "link",
    "style",
    "meta",
    "base",
  ];

  const dangerousAttrs = [
    "onerror",
    "onload",
    "onclick",
    "onmouseover",
    "onfocus",
    "srcdoc",
  ];

  // Remove dangerous tags
  dangerousTags.forEach((tag) => {
    const elements = doc.getElementsByTagName(tag);
    Array.from(elements).forEach((el) => el.remove());
  });

  // Remove dangerous attributes
  const allElements = doc.getElementsByTagName("*");
  Array.from(allElements).forEach((el) => {
    Array.from(el.attributes).forEach((attr) => {
      const name = attr.name.toLowerCase();
      const value = attr.value.toLowerCase();

      if (
        name.startsWith("on") || // Event handlers
        value.startsWith("javascript:") || // JS URLs
        dangerousAttrs.includes(name)
      ) {
        el.removeAttribute(attr.name);
      }
    });
  });

  return doc.body.innerHTML;
};

export default sanitizeHtml;
