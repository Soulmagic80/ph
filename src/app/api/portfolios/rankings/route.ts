import { getSupabaseServer } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

// Fix for Supabase + Next.js 15 Edge Runtime conflict
export const runtime = 'nodejs'

export async function POST(_request: NextRequest) {
    try {
        const supabase = await getSupabaseServer();
        
        const { portfolioIds } = await _request.json();

        if (!portfolioIds || !Array.isArray(portfolioIds)) {
            return NextResponse.json(
                { error: 'portfolioIds array is required' },
                { status: 400 }
            );
        }

        const { data: rankingData, error } = await supabase
            .from('portfolio_rankings')
            .select('id, current_rank, upvote_count')
            .in('id', portfolioIds);

        if (error) {
            console.error('Error fetching rankings:', error);
            return NextResponse.json(
                { error: 'Failed to fetch rankings' },
                { status: 500 }
            );
        }

        return NextResponse.json({ rankings: rankingData || [] });
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
} 