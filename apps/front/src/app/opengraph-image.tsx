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

// Image generation
export default async function Image() {
  // Font loading, process.cwd() is Next.js project directory
  const gilroyBlack = await readFile(
    join(process.cwd(), "src/assets/fonts/Gilroy/Gilroy-Black.ttf"),
  );

  const gilroyBlackItalic = await readFile(
    join(process.cwd(), "src/assets/fonts/Gilroy/Gilroy-BlackItalic.ttf"),
  );

  const gilroyMedium = await readFile(
    join(process.cwd(), "src/assets/fonts/Gilroy/Gilroy-Medium.ttf"),
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
      <p
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          justifyContent: "center",
          paddingBottom: 38,
        }}
      >
        <span
          style={{
            fontSize: 128,
            fontStyle: "italic",
            fontFamily: "Gilroy-black",
          }}
        >
          Kissnotes
        </span>
        <span
          style={{
            fontSize: 32,
            fontStyle: "italic",
            fontFamily: "Gilroy-medium",
          }}
        >
          By Motiontober
        </span>
      </p>
      <p
        style={{
          fontSize: 48,
          textAlign: "center",
          fontFamily: "Gilroy-medium",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ paddingBottom: 8 }}>A free and open-source</span>
        <span>After Effects expressions sharing platform.</span>
      </p>
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
      ],
    },
  );
}
