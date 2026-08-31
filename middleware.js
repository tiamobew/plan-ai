import { NextResponse } from "next/server";
import { ACCESS_COOKIE } from "./lib/config";

// เส้นทางที่ต้องผ่านการยืนยันรหัสก่อน
const PROTECTED = ["/dashboard", "/create", "/plan"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const needsAuth = PROTECTED.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );
  if (!needsAuth) return NextResponse.next();

  const authed = request.cookies.get(ACCESS_COOKIE)?.value === "1";
  if (authed) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/";
  url.searchParams.set("next", pathname);
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/dashboard/:path*", "/create/:path*", "/plan/:path*"],
};
