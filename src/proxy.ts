import { NextRequest, NextResponse } from "next/server";

export async function proxy(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  const publicPages = [
    "/",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/auth/callback",
    "/verify-otp",
  ];

  const isPublicPage =
    publicPages.includes(pathname) || pathname.startsWith("/auth/callback");

  if (!token && !isPublicPage) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
  if (token && isPublicPage && pathname !== "/") {
    return NextResponse.redirect(new URL("/mailboxes", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
