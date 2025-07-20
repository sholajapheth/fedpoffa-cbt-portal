import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/forgot-password", "/"];

  // Check if the current path is a public route
  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // For now, let the client-side handle authentication checks
  // The middleware will only handle basic route protection
  // Authentication state is managed client-side with Zustand + TanStack Query

  // If trying to access dashboard without being on a public route, let it through
  // The client-side components will handle redirects based on auth state
  if (pathname.startsWith("/dashboard") && !isPublicRoute) {
    // Let the client-side handle auth checks
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|manifest.json).*)"],
};
