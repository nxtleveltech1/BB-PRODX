import { NextRequest, NextResponse } from "next/server";

// Light-weight middleware that checks JWT token from cookies without database access
// Avoid calling auth() which requires database queries
export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Define protected routes
  const protectedRoutes = ["/dashboard", "/profile", "/settings"];
  const adminRoutes = ["/admin"];
  const authRoutes = ["/auth/signin", "/auth/signup"];

  // Check if the current path is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  // Get JWT token from cookies (set by NextAuth)
  const token = request.cookies.get("next-auth.session-token")?.value;
  const isAuthenticated = !!token;

  // Redirect authenticated users away from auth pages
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protect dashboard and profile routes
  if (isProtectedRoute && !isAuthenticated) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Protect admin routes (without database check - role validation happens in page/server component)
  if (isAdminRoute && !isAuthenticated) {
    const signInUrl = new URL("/auth/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api routes that aren't auth
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api(?!/auth)|_next/static|_next/image|favicon.ico|public).*)",
  ],
};