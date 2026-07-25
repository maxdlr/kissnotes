/** biome-ignore-all lint/correctness/useUniqueElementIds: dont care */
import Header from "@/components/Header";
import type { Metadata } from "next";
import { ReactNode } from "react";
import "../assets/globals.css";
import { gilroy } from "./fonts";
import { Providers } from "./providers";
import MobileMenu from "@/components/MobileMenu";
import GlobalSearcher from "@/components/GlobalSearcher";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL!),
  title: "Kissnotes",
  description: "The After Effects expression sharing platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning data-lt-installed>
      <body
        className={`${gilroy.className} antialiased bg-background text-foreground`}
      >
        <Providers>
          <main className="p-4 sm:p-6 md:p-8 space-y-4 sm:space-y-6 md:space-y-8 max-sm:pb-24">
            <Header />
            {children}
          </main>
          <MobileMenu className="sm:hidden" />
          <GlobalSearcher />
          <div id="modal-full" />
          <div id="modal" />
          <div id="tooltip" />
          <div id="dropdown" />
        </Providers>
      </body>
    </html>
  );
}
