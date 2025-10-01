import { getSupabaseServer } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";

export const runtime = 'nodejs';

export async function POST(_request: NextRequest) {
    try {
        const supabase = await getSupabaseServer();

        // Check if user is admin
        const { data: { user } } = await supabase.auth.getUser();
        
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();

        if (!profile?.is_admin) {
            return NextResponse.json(
                { error: 'Forbidden - Admin only' },
                { status: 403 }
            );
        }

        // Refresh the materialized view
        // @ts-ignore - Function exists in DB but not yet in generated types
        const { error } = await supabase.rpc('refresh_portfolio_rankings_manual');

        if (error) {
            console.error('Error refreshing rankings:', error);
            return NextResponse.json(
                { error: 'Failed to refresh rankings', details: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Rankings refreshed successfully'
        });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

