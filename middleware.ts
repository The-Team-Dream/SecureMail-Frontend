import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const otp = req.cookies.get("otp")?.value;
  const { pathname } = req.nextUrl;
  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }
  if (!otp && pathname === "verify-otp") {
    return NextResponse.redirect(new URL("/sign-up", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/verify-otp"],
};
