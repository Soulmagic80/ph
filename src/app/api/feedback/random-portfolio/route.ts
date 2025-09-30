import { getSupabaseServer } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest) {
    try {
        const supabase = await getSupabaseServer();
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            );
        }

        // First, let's see ALL portfolios to debug
        const { data: _ } = await supabase
            .from('portfolios')
            .select(`
                id,
                title,
                user_id,
                status,
                published
            `)
            .is('deleted_at', null);
        
        
        // Get portfolios that user can rate (published, not own, not already rated)
        
        const { data: availablePortfolios, error: portfoliosError } = await supabase
            .from('portfolios')
            .select(`
                id,
                title,
                user_id,
                status,
                published
            `)
            .eq('status', 'approved')
            .eq('published', true)
            .neq('user_id', user.id)
            .is('deleted_at', null);


        if (portfoliosError) {
            console.error('Error fetching available portfolios:', portfoliosError);
            return NextResponse.json(
                { error: 'Failed to fetch portfolios' },
                { status: 500 }
            );
        }

        if (!availablePortfolios || availablePortfolios.length === 0) {
            return NextResponse.json(
                { error: 'No portfolios available for feedback' },
                { status: 404 }
            );
        }

        // Filter out portfolios user has already rated
        const { data: userFeedback, error: feedbackError } = await supabase
            .from('feedback_status')
            .select('portfolio_id')
            .eq('user_id', user.id)
            .eq('status', 'completed');

        if (feedbackError) {
            console.error('Error fetching user feedback:', feedbackError);
            return NextResponse.json(
                { error: 'Failed to check feedback status' },
                { status: 500 }
            );
        }

        const ratedPortfolioIds = new Set(userFeedback?.map(f => f.portfolio_id) || []);
        
        const unratedPortfolios = availablePortfolios.filter(p => !ratedPortfolioIds.has(p.id));

        if (unratedPortfolios.length === 0) {
            return NextResponse.json(
                { error: 'No unrated portfolios available' },
                { status: 404 }
            );
        }

        // Get feedback counts for weighted selection
        const portfolioIds = unratedPortfolios.map(p => p.id);
        const { data: feedbackCounts, error: countsError } = await supabase
            .from('feedback_status')
            .select('portfolio_id')
            .in('portfolio_id', portfolioIds)
            .eq('status', 'completed');

        if (countsError) {
            console.error('Error fetching feedback counts:', countsError);
            return NextResponse.json(
                { error: 'Failed to get feedback counts' },
                { status: 500 }
            );
        }

        // Count feedback per portfolio
        const feedbackCountMap = new Map<string, number>();
        feedbackCounts?.forEach(fc => {
            const count = feedbackCountMap.get(fc.portfolio_id) || 0;
            feedbackCountMap.set(fc.portfolio_id, count + 1);
        });

        // Create weighted portfolio list (portfolios with fewer feedback appear more often)
        const weightedPortfolios: typeof unratedPortfolios = [];
        const maxFeedback = Math.max(...Array.from(feedbackCountMap.values()), 0);
        
        unratedPortfolios.forEach(portfolio => {
            const feedbackCount = feedbackCountMap.get(portfolio.id) || 0;
            // Weight: portfolios with fewer feedback get higher weight
            // Formula: (maxFeedback + 1) - feedbackCount + 1
            const weight = Math.max(1, (maxFeedback + 2) - feedbackCount);
            
            // Add portfolio multiple times based on weight
            for (let i = 0; i < weight; i++) {
                weightedPortfolios.push({
                    ...portfolio,
                    feedbackCount
                } as any);
            }
        });

        // Select random portfolio from weighted list
        const randomIndex = Math.floor(Math.random() * weightedPortfolios.length);
        const selectedPortfolio = weightedPortfolios[randomIndex];
        
        return NextResponse.json({
            success: true,
            portfolio: {
                id: selectedPortfolio.id,
                title: selectedPortfolio.title,
                feedbackCount: (selectedPortfolio as any).feedbackCount || 0
            }
        });

    } catch (error) {
        console.error('Error in random portfolio API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
