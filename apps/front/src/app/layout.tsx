/** biome-ignore-all lint/correctness/useUniqueElementIds: dont care */
import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import "../assets/globals.css";
import { gilroy } from "./fonts";
import { Providers } from "./providers";

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
          <main className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8">
            <Header />
            <Hero />
            {children}
          </main>
          <div id="modal-full" />
          <div id="modal" />
          <div id="tooltip" />
          <div id="dropdown" />
        </Providers>
      </body>
    </html>
  );
}
