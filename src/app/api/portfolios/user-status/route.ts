import { getSupabaseServer } from "@/lib/supabase-server";
import { NextRequest, NextResponse } from "next/server";
// Fix for Supabase + Next.js 15 Edge Runtime conflict
export const runtime = 'nodejs'


export async function GET(__request: NextRequest) {
    try {
        const supabase = await getSupabaseServer();
        
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Fetch user's portfolio 
        const { data: portfolio, error: portfolioError } = await supabase
            .from('portfolios')
            .select(`
                id,
                title,
                website_url,
                status,
                created_at,
                updated_at,
                images,
                approved,
                published
            `)
            .eq('user_id', user.id)
            .is('deleted_at', null)
            .single();

        if (portfolioError) {
            // If no portfolio exists, return null (user hasn't created one yet)
            if (portfolioError.code === 'PGRST116') {
                return NextResponse.json(null);
            }
            console.error('Error fetching portfolio:', portfolioError);
            return NextResponse.json({ error: "Failed to fetch portfolio" }, { status: 500 });
        }

        // Fetch feedback count separately
        let feedbackCount = 0;
        const { data: feedbackData, error: feedbackError } = await supabase
            .from('user_feedback_count')
            .select('count')
            .eq('user_id', user.id)
            .single();

        if (feedbackError && feedbackError.code !== 'PGRST116') {
            console.warn('Error fetching feedback count:', feedbackError);
        } else if (feedbackData) {
            feedbackCount = feedbackData.count || 0;
        }

        // Return portfolio data with feedback count
        const portfolioData = {
            id: portfolio.id,
            title: portfolio.title,
            website_url: portfolio.website_url,
            status: portfolio.status,
            created_at: portfolio.created_at,
            updated_at: portfolio.updated_at,
            images: portfolio.images,
            approved: portfolio.approved,
            published: portfolio.published,
            feedback_count: feedbackCount
        };

        return NextResponse.json(portfolioData);

    } catch (error) {
        console.error('Error in user-status API:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

