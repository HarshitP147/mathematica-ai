import { type NextRequest, NextResponse } from "next/server";
import { createClient } from "@/util/supabase/middleware";

export async function middleware(request: NextRequest) {
    // Create Supabase client with automatic cookie handling
    const { supabase, response } = createClient(request);

    // Get the current user
    const {
        data: { user },
    } = await supabase.auth.getUser();

    const isAuthPage = request.nextUrl.pathname.startsWith("/auth");
    const isProtectedRoute = request.nextUrl.pathname.startsWith("/chat");

    // If user is logged in and tries to access auth page, redirect to home
    if (user && isAuthPage) {
        return NextResponse.redirect(new URL("/", request.url));
    }

    // If user is not logged in and tries to access protected routes, redirect to auth
    if (!user && isProtectedRoute) {
        const redirectUrl = new URL("/auth", request.url);
        redirectUrl.searchParams.set("redirectTo", request.nextUrl.pathname);
        return NextResponse.redirect(redirectUrl);
    }

    return response;
}

export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public files (public folder)
         */
        "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
    ],
};
