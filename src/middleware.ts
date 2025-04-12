// src/middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// List of paths that do NOT require authentication
const publicPaths = ["/signin"];

export async function middleware(request: NextRequest) {
  // Get the token from the request
  // Make sure to use the same secret as in your Auth.js config
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const path = request.nextUrl.pathname;

  if (path.startsWith("/user/")) {
    return NextResponse.next();
  }

  // Check if the current path is considered public
  const isPublicPath = publicPaths.some((publicPath) =>
    path.startsWith(publicPath)
  );

  // --- Redirect Logic ---

  // 1. If trying to access a protected path without a token, redirect to signin
  if (!token && !isPublicPath) {
    // Construct the signin URL with a callbackUrl parameter
    const signInUrl = new URL("/signin", request.url);
    signInUrl.searchParams.set("callbackUrl", path); // Remember where user was going
    return NextResponse.redirect(signInUrl);
  }

  // 2. If trying to access a public path (like signin) *with* a token, redirect to home
  if (token && isPublicPath) {
    return NextResponse.redirect(new URL("/", request.url)); // Redirect logged-in users from signin page
  }

  // 3. If none of the above, allow the request to proceed
  return NextResponse.next();
}

// --- Configuration: Matcher ---
// Define which paths the middleware should run on.
// This example applies it to most paths, excluding API routes, static files, and image optimization files.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
