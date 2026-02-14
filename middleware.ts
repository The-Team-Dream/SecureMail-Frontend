import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;
  const publicPages = ["/sign-in", "/sign-up", "/forgot-password"].includes(
    pathname,
  );
  const isPublicAssets =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/static") ||
    pathname.includes(".");

  if (isPublicAssets) {
    return NextResponse.next();
  }
  if (!token && !publicPages) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  if (token && publicPages) {
    return NextResponse.redirect(new URL("/", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
