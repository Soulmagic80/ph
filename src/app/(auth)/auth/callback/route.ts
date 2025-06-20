import { createServerSupabaseClient } from '@/lib/supabase/server';
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get("code")
    const redirectedFrom = requestUrl.searchParams.get("redirectedFrom") || "/"

    if (code) {
        const supabase = createServerSupabaseClient()
        await supabase.auth.exchangeCodeForSession(code)
    }

    return NextResponse.redirect(`${requestUrl.origin}${redirectedFrom}`)
} 