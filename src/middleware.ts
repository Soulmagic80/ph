import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"

export async function middleware(req: NextRequest) {
    const res = NextResponse.next()
    const supabase = createMiddlewareClient({ req, res })

    const {
        data: { session },
    } = await supabase.auth.getSession()

    // If there is no session and the user is trying to access a protected route
    if (!session && req.nextUrl.pathname.startsWith("/user")) {
        return NextResponse.redirect(new URL("/login", req.url))
    }

    // If there is a session and the user is trying to access auth routes
    if (session && (req.nextUrl.pathname.startsWith("/login"))) {
        return NextResponse.redirect(new URL("/", req.url))
    }

    return res
}

export const config = {
    matcher: ["/user/:path*", "/login"],
} 