import type { Metadata } from "next";
// import { Geist, Geist_Mono } from "next/font/google";
import "../assets/globals.css";
import localFont from "next/font/local";
import { Providers } from "./providers";

const gilroy = localFont({
  variable: "--font-gilroy",
  src: [
    {
      path: "../assets/fonts/GilroyRegular/font.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../assets/fonts/GilroySemiBoldItalic/font.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "../assets/fonts/GilroyBold/font.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/GilroyExtraBold/font.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "../assets/fonts/GilroyMediumItalic/font.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "../assets/fonts/GilroySemiBold/font.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "../assets/fonts/GilroyBoldItalic/font.woff2",
      weight: "700",
      style: "italic",
    },
    {
      path: "../assets/fonts/GilroySemiBoldItalic/font.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "../assets/fonts/GilroyRegularItalic/font.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "../assets/fonts/GilroyMedium/font.woff2",
      weight: "500",
      style: "normal",
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
        className={`${gilroy.variable} antialiased bg-background text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
