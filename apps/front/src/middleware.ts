// middleware.ts (at project root or src/)

import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Match /@username (but not Next.js internals or other routes)
  const match = pathname.match(/^\/@([^/]+)(\/.*)?$/);
  if (match) {
    const handle = match[1];
    const rest = match[2] || "";
    return NextResponse.rewrite(new URL(`/u/${handle}${rest}`, request.url));
  }
}

export const config = {
  matcher: ["/@:path*"],
};
