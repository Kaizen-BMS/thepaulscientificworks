import { NextResponse } from "next/server";

export function middleware(request) {
  const { pathname } = request.nextUrl;

  const isAdminRoute =
    pathname.startsWith("/admin");

  const isSuperAdminRoute =
    pathname.startsWith("/superadmin");

  const isLoginPage =
    pathname === "/admin/login" ||
    pathname === "/superadmin/login";

  // allow public routes
  if (
    !isAdminRoute &&
    !isSuperAdminRoute
  ) {
    return NextResponse.next();
  }

  // allow login pages
  if (isLoginPage) {
    return NextResponse.next();
  }

  // ONLY check cookie existence
  const token =
    request.cookies.get("psw_admin_token")?.value;

  // no token
  if (!token) {
    const loginPath = isSuperAdminRoute
      ? "/superadmin/login"
      : "/admin/login";

    return NextResponse.redirect(
      new URL(loginPath, request.url)
    );
  }

  // DO NOT VERIFY JWT HERE
  // middleware edge runtime issue

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/superadmin/:path*",
  ],
};