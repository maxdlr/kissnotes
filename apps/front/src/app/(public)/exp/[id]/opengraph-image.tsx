import { getHandle } from "@/utils/userUtils";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { normalizeTokens, Prism } from "prism-react-renderer";
import { fetchExpressionById } from "./_utils/fetchExpressionById";

// Image metadata
export const alt = "Kissnotes by Motiontober";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

// Approximate Tokyo Night colors, matching the theme used in the code editor (InputCode.tsx),
// so the OG preview looks consistent with the actual editing experience.
const TOKEN_COLORS: Record<string, string> = {
  comment: "#565f89",
  keyword: "#bb9af7",
  builtin: "#2ac3de",
  "class-name": "#e0af68",
  function: "#7aa2f7",
  string: "#9ece6a",
  number: "#ff9e64",
  boolean: "#ff9e64",
  operator: "#89ddff",
  punctuation: "#a9b1d6",
  variable: "#c0caf5",
  property: "#7dcfff",
  tag: "#f7768e",
  "attr-name": "#e0af68",
  regex: "#b4f9f8",
};

const getTokenColor = (types: string[]): string => {
  const type = types.find((t) => TOKEN_COLORS[t]);
  return type ? TOKEN_COLORS[type] : "#c0caf5";
};

// Image generation
export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const expression = await fetchExpressionById(id).catch(() =>
    fetchExpressionById(id, true),
  );

  // Font loading, process.cwd() is Next.js project directory
  const gilroyBlack = await readFile(
    join(process.cwd(), "src/assets/fonts/Gilroy/Gilroy-Black.ttf"),
  );

  const gilroyBold = await readFile(
    join(process.cwd(), "src/assets/fonts/Gilroy/Gilroy-Bold.ttf"),
  );

  const gilroyBlackItalic = await readFile(
    join(process.cwd(), "src/assets/fonts/Gilroy/Gilroy-BlackItalic.ttf"),
  );

  const gilroyMedium = await readFile(
    join(process.cwd(), "src/assets/fonts/Gilroy/Gilroy-Medium.ttf"),
  );

  const firaCodeRegular = await readFile(
    join(process.cwd(), "src/assets/fonts/FiraCode/FiraCode-Regular.ttf"),
  );

  // Long lines would overflow the right column, so we clip them to keep the layout intact.
  const MAX_CODE_LINE_LENGTH = 42;
  const MAX_CODE_LINES = 10;
  const codePreviewLines = expression.code.lines
    .slice(0, MAX_CODE_LINES)
    .map((line) =>
      line.content.length > MAX_CODE_LINE_LENGTH
        ? `${line.content.slice(0, MAX_CODE_LINE_LENGTH)}…`
        : line.content,
    );

  // Tokenizing the whole clipped block (rather than line by line) lets Prism track
  // context across lines correctly (e.g. multi-line comments); normalizeTokens then
  // splits the result back into per-line token arrays for rendering as flex rows.
  const tokenizedCodeLines = normalizeTokens(
    Prism.tokenize(codePreviewLines.join("\n"), Prism.languages.jsx),
  );

  return new ImageResponse(
    // ImageResponse JSX element
    <div
      style={{
        background: "#0c2135",
        color: "white",
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          paddingBottom: 8,
        }}
      >
        <p
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 64,
              fontStyle: "italic",
              fontFamily: "Gilroy-black",
            }}
          >
            Kissnotes
          </span>
          <span
            style={{
              fontSize: 20,
              fontStyle: "italic",
              fontFamily: "Gilroy-medium",
            }}
          >
            By Motiontober
          </span>
        </p>
      </div>

      <div
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            justifyContent: "center",
            width: "40%",
            padding: "0 48px",
            fontFamily: "Gilroy-medium",
            textAlign: "right",
          }}
        >
          <span
            style={{
              fontSize: 40,
              fontFamily: "Gilroy-Bold",
            }}
          >
            {expression.title}
          </span>
          <span style={{ fontSize: 28, paddingTop: 24, color: "#9eff28" }}>
            by {getHandle(expression.author.username)}
          </span>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "60%",
            padding: "0 48px",
            borderLeft: "2px solid rgba(255, 255, 255, 0.15)",
          }}
        >
          {tokenizedCodeLines.map((lineTokens, lineIndex) => (
            <div
              key={lineIndex}
              style={{
                display: "flex",
                fontFamily: "FiraCode",
                fontSize: 22,
                whiteSpace: "pre",
              }}
            >
              {lineTokens.map((token, tokenIndex) => (
                <span
                  key={tokenIndex}
                  style={{ display: "flex", color: getTokenColor(token.types) }}
                >
                  {token.content}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>,
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: "Gilroy-black",
          data: gilroyBlack,
          style: "normal",
        },
        {
          name: "Gilroy-black",
          data: gilroyBlackItalic,
          style: "italic",
        },
        {
          name: "Gilroy-medium",
          data: gilroyMedium,
        },
        {
          name: "Gilroy-Bold",
          data: gilroyBold,
        },
        {
          name: "FiraCode",
          data: firaCodeRegular,
        },
      ],
    },
  );
}
