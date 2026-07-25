import { getHandle } from "@/utils/userUtils";
import { ExpressionModel } from "@kissnotes/types";
import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Image metadata
export const alt = "Kissnotes by Motiontober";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const fetchExpressionById = async (id: string) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/expressions/read?id=${id}`,
    {
      cache: "no-store",
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch expression data");
  }

  return res.json();
};

// Image generation
export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const expression: ExpressionModel = await fetchExpressionById(id);

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

  // Long lines would overflow the right column, so we clip them to keep the layout intact.
  const MAX_CODE_LINE_LENGTH = 42;
  const MAX_CODE_LINES = 4;
  const codePreviewLines = expression.code.lines
    .slice(0, MAX_CODE_LINES)
    .map((line) =>
      line.content.length > MAX_CODE_LINE_LENGTH
        ? `${line.content.slice(0, MAX_CODE_LINE_LENGTH)}…`
        : line.content,
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
          width: "50%",
          padding: "0 48px",
          fontFamily: "Gilroy-medium",
          textAlign: "right",
        }}
      >
        <span
          style={{
            fontSize: 48,
            fontFamily: "Gilroy-Bold",
            paddingBottom: 8,
          }}
        >
          {expression.title}
        </span>
        <span style={{ fontSize: 28 }}>
          by {getHandle(expression.author.username)}
        </span>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          width: "50%",
          padding: "0 48px",
          borderLeft: "2px solid rgba(255, 255, 255, 0.15)",
        }}
      >
        {codePreviewLines.map((line, index) => (
          <span
            key={index}
            style={{
              fontFamily: "monospace",
              fontSize: 24,
              color: "rgba(255, 255, 255, 0.85)",
              whiteSpace: "pre",
            }}
          >
            {line}
          </span>
        ))}
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
      ],
    },
  );
}
