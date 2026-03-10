import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const handleProfileUri = (pathname: string, url: string) => {
  const match = pathname.match(/^\/@([^/]+)(\/.*)?$/);
  if (match) {
    const handle = match[1];
    const rest = match[2] || "";
    return NextResponse.rewrite(new URL(`/u/${handle}${rest}`, url));
  }
};

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  return handleProfileUri(pathname, request.url);
}

export const config = {
  matcher: "/@:path(.*)",
};
