import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;
  const publicPages = [
    "/",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
    "/reset-password",
    "/auth/callback",
  ];

  const isPublicPage = publicPages.includes(pathname);
  const isProtectedArea =
    pathname.startsWith("/dashboard") || pathname.startsWith("/mailbox");

  if (!token && isProtectedArea) {
    const url = new URL("/sign-in", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (token && isPublicPage) {
    return NextResponse.redirect(new URL("/dashboard/mailboxes", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
