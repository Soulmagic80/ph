import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    console.log('🔄 Auth callback route: Starting email confirmation process');
    
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const next = searchParams.get('next') || '/';
    
    console.log('📧 Auth callback: Code received:', code ? 'YES' : 'NO');
    console.log('📍 Auth callback: Redirect target:', next);

    if (code) {
        try {
            const supabase = await createServerSupabaseClient();
            
            console.log('🔐 Auth callback: Exchanging code for session');
            const { error } = await supabase.auth.exchangeCodeForSession(code);
            
            if (error) {
                console.error('❌ Auth callback: Error exchanging code:', error);
                return NextResponse.redirect(
                    new URL(`/auth/login?error=${encodeURIComponent(error.message)}`, request.url)
                );
            }
            
            console.log('✅ Auth callback: Code exchanged successfully, redirecting to:', next);
            return NextResponse.redirect(new URL(next, request.url));
            
        } catch (error) {
            console.error('💥 Auth callback: Unexpected error:', error);
            return NextResponse.redirect(
                new URL('/auth/login?error=An unexpected error occurred', request.url)
            );
        }
    }
    
    console.log('⚠️ Auth callback: No code provided, redirecting to login');
    return NextResponse.redirect(new URL('/auth/login', request.url));
}

