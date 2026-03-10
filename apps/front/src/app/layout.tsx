/** biome-ignore-all lint/correctness/useUniqueElementIds: <explanation> */
import type { Metadata } from "next";
import localFont from "next/font/local";
import "../assets/globals.css";
import { Providers } from "./providers";
import { Header } from "@/components/Header";

const gilroy = localFont({
  variable: "--font-gilroy",
  src: [
    {
      path: "../assets/fonts/Gilroy/Gilroy-UltraLight.ttf",
      weight: "100",
      style: "normal",
    },
    {
      path: "../assets/fonts/Gilroy/Gilroy-UltraLightItalic.ttf",
      weight: "100",
      style: "italic",
    },

    {
      path: "../assets/fonts/Gilroy/Gilroy-Light.ttf",
      weight: "200",
      style: "normal",
    },
    {
      path: "../assets/fonts/Gilroy/Gilroy-LightItalic.ttf",
      weight: "200",
      style: "italic",
    },

    {
      path: "../assets/fonts/Gilroy/Gilroy-Thin.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../assets/fonts/Gilroy/Gilroy-ThinItalic.ttf",
      weight: "300",
      style: "italic",
    },

    {
      path: "../assets/fonts/Gilroy/Gilroy-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/Gilroy/Gilroy-RegularItalic.ttf",
      weight: "400",
      style: "italic",
    },

    {
      path: "../assets/fonts/Gilroy/Gilroy-SemiBold.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../assets/fonts/Gilroy/Gilroy-SemiBoldItalic.ttf",
      weight: "500",
      style: "italic",
    },

    {
      path: "../assets/fonts/Gilroy/Gilroy-Bold.ttf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/Gilroy/Gilroy-BoldItalic.ttf",
      weight: "700",
      style: "italic",
    },

    {
      path: "../assets/fonts/Gilroy/Gilroy-ExtraBold.ttf",
      weight: "800",
      style: "normal",
    },
    {
      path: "../assets/fonts/Gilroy/Gilroy-ExtraBoldItalic.ttf",
      weight: "800",
      style: "italic",
    },

    {
      path: "../assets/fonts/Gilroy/Gilroy-Heavy.ttf",
      weight: "900",
      style: "normal",
    },
    {
      path: "../assets/fonts/Gilroy/Gilroy-HeavyItalic.ttf",
      weight: "900",
      style: "italic",
    },
  ],
});

export const metadata: Metadata = {
  title: "Kissnotes",
  description: "The AE expression sharing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-lt-installed>
      <body
        className={`${gilroy.className} antialiased bg-background text-foreground`}
      >
        <Providers>
          <Header />
          {children}
          <div id="modal-full" />
          <div id="modal" />
          <div id="tooltip" />
          <div id="dropdown" />
        </Providers>
      </body>
    </html>
  );
}
