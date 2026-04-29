import { auth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy (formerly Middleware) for Next.js 16+
 * Handles authentication checks and adds security headers.
 */
export const runtime = 'nodejs';

export async function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;
    console.log('Proxy running for:', pathname);

    // 1. Get Session
    const session = await auth.api.getSession({
        headers: request.headers,
    });
    
    // DEBUG: Force check for dashboard
    if (pathname.startsWith('/dashboard') && !session) {
        console.log('FORCE REDIRECT: No session for dashboard');
        return NextResponse.redirect(new URL("/login", request.url));
    }
    console.log('Proxy Session:', session ? `User ${session.user.id}` : 'None');

    // 2. Define Protected and Auth Routes
    const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup");
    const isProtectedRoute = pathname.startsWith("/generate") ||
        pathname.startsWith("/dashboard") ||
        pathname.startsWith("/api/pages") ||
        pathname.startsWith("/api/generate");

    // 3. Handle Authentication Logic
    if (session && isAuthRoute) {
        // Redirect logged-in users away from login/signup
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    if (!session && isProtectedRoute) {
        // Redirect anonymous users to login for protected routes
        if (pathname.startsWith("/api/")) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        console.log('Unauthorized access to:', pathname, '- Redirecting to /login');
        return NextResponse.redirect(new URL("/login", request.url));
    }

    // 4. Create Response and add user info to request headers if session exists
    const requestHeaders = new Headers(request.headers);
    if (session) {
        console.log('Setting headers for User:', session.user.id);
        requestHeaders.set("x-user-id", session.user.id);
        requestHeaders.set("x-user-email", session.user.email);
        
        // Also try setting it on the original request object if possible
        try {
            (request.headers as any).set("x-user-id", session.user.id);
        } catch (e) {
            // Might be read-only
        }
    }

    const response = NextResponse.next({
        request: {
            headers: requestHeaders,
        },
    });

    // Prevent clickjacking
    response.headers.set("X-Frame-Options", "DENY");

    // Prevent MIME type sniffing
    response.headers.set("X-Content-Type-Options", "nosniff");

    // Referrer policy
    response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

    // Strict Transport Security (HSTS)
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");

    // Content Security Policy (Baseline)
    response.headers.set(
        "Content-Security-Policy",
        "default-src 'self'; " +
        "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.tailwindcss.com; " +
        "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
        "font-src 'self' https://fonts.gstatic.com; " +
        "img-src 'self' data: https://picsum.photos https://*.picsum.photos; " +
        "connect-src 'self';"
    );

    return response;
}

// Configure which paths this proxy should run on
export const config = {
    matcher: [
        "/dashboard",
        "/dashboard/:path*",
        "/generate",
        "/generate/:path*",
        "/api/pages",
        "/api/pages/:path*",
        "/api/generate",
        "/api/generate/:path*",
        "/login",
        "/signup"
    ],
};

export default proxy;
