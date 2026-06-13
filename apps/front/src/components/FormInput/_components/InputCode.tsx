import { firaCode } from "@/app/fonts";
import { javascript } from "@codemirror/lang-javascript";
import * as events from "@uiw/codemirror-extensions-events";
import { element } from "@uiw/codemirror-extensions-events";
import { hyperLink } from "@uiw/codemirror-extensions-hyper-link";
import { tokyoNightInit } from "@uiw/codemirror-theme-tokyo-night";
import ReactCodeMirror from "@uiw/react-codemirror";
import { InputCodeProps } from "../interfaces";
import { Settings } from "@uiw/codemirror-themes";

const InputCode = ({
  value,
  height,
  onChange,
  onFocus,
  onUnfocus,
  className,
}: InputCodeProps) => {
  const focusEvent = events.content({
    focus: () => onFocus?.(),
    blur: () => onUnfocus?.(),
  });
  const theme = tokyoNightInit({
    settings: {
      background: "transparent",
      fontFamily: firaCode.style.fontFamily,
      fontSize: "14px",
      // backgroundImage: "",
      // foreground: "#75baff",
      // caret: "var(--color-primary)",
      // selection: "var(--color-accent)",
      // selectionMatch: "#036dd626",
      lineHighlight: "#8a91991a",
      gutterBackground: "transparent",
      gutterBorder: "transparent",
      gutterForeground: "var(--color-secondary)",
    } as Settings,
    // styles: [
    //   { tag: t.comment, color: "#787b8099" },
    //   { tag: t.variableName, color: "#0080ff" },
    //   { tag: [t.string, t.special(t.brace)], color: "#5c6166" },
    //   { tag: t.number, color: "#5c6166" },
    //   { tag: t.bool, color: "#5c6166" },
    //   { tag: t.null, color: "#5c6166" },
    //   { tag: t.keyword, color: "#5c6166" },
    //   { tag: t.operator, color: "#5c6166" },
    //   { tag: t.className, color: "#5c6166" },
    //   { tag: t.definition(t.typeName), color: "#5c6166" },
    //   { tag: t.typeName, color: "#5c6166" },
    //   { tag: t.angleBracket, color: "#5c6166" },
    //   { tag: t.tagName, color: "#5c6166" },
    //   { tag: t.attributeName, color: "#5c6166" },
    // ],
  });
  return (
    <ReactCodeMirror
      value={value as string}
      height={height}
      extensions={[
        javascript({ jsx: true }),
        hyperLink,
        focusEvent,
        element({
          type: "content",
          props: {
            inputMode: "none",
            // className: "leading-4",
          },
        }),
      ]}
      onChange={(value) => onChange({ target: { name: "codeBlock", value } })}
      theme={theme}
      className={`w-full ${className}`}
    />
  );
};
export default InputCode;
