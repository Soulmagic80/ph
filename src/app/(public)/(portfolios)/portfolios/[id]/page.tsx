import { PreviewBanner } from "@/components/portfolio/detail/PreviewBanner";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import PortfolioDetailClient from "./PortfolioDetailClient";

interface PortfolioDetailPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
    const supabase = createServerSupabaseClient();
    const { id } = await params;

    // Get user session - using getUser() for better security
    const { data: { user } } = await supabase.auth.getUser();

    // Check if user is admin
    let isAdmin = false;
    if (user) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();
        isAdmin = profile?.is_admin || false;
    }

    // Fetch portfolio data - admins can see all portfolios, others only published
    let query = supabase
        .from("portfolios")
        .select(`
            *,
            rank_history(*),
            portfolio_tools(id, portfolio_id, tool_id, created_at, tool:tools(id, name, category, created_at, updated_at)),
            comments(*),
            user:profiles(*),
            rating(*),
            rating_counts(
                *,
                feedback_chip:feedback_chips(*)
            )
        `)
        .eq("id", id)
        .is("deleted_at", null);  // Exclude soft-deleted portfolios

    // Only filter by published status for non-admins, but allow users to see their own portfolios
    if (!isAdmin) {
        if (user) {
            // Allow published portfolios OR own portfolios (draft/pending/approved)
            query = query.or(`published.eq.true,user_id.eq.${user.id}`);
        } else {
            // Non-authenticated users can only see published portfolios
            query = query.eq("published", true);
        }
    }

    const { data: portfolio, error } = await query.single();

    if (error || !portfolio) {
        console.error('❌ Portfolio not found or error:', error);
        notFound();
    }

    // Fetch current ranking and upvote data directly (same logic as API route)
    let rankingData = null;
    try {
        const serviceRoleClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: rankingResult } = await serviceRoleClient
            .from('portfolio_rankings')
            .select('id, current_rank, upvote_count')
            .eq('id', id)
            .single();

        rankingData = rankingResult;
    } catch (error) {
        console.error('Error fetching ranking data:', error);
    }

    // Fetch rating summary from materialized view using service role
    let ratingSummary = null;
    try {
        const serviceRoleClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        );

        const { data: ratingResult } = await serviceRoleClient
            .from("portfolio_rating_summary")
            .select("*")
            .eq("portfolio_id", id)
            .order("type", { ascending: true })
            .order("rank_in_type", { ascending: true });

        ratingSummary = ratingResult;
    } catch (error) {
        console.error('Error fetching rating summary:', error);
    }

    // Combine the data
    const portfolioWithRanking = {
        ...portfolio,
        current_rank: rankingData?.current_rank || null,
        upvote_count: rankingData?.upvote_count || 0,
        previous_rank: null, // Not available in current query
        rank_change: null, // Not available in current query
        portfolio_rating_summary: ratingSummary || [],
        // Required by PortfolioWithRelations but not used in this context
        rank_history: null,
        tools: portfolio.portfolio_tools || null,
        services: null,
        comments: portfolio.comments || null,
        portfolio_rating: null,
        portfolio_rating_counts: null,
        // Convert user.is_admin from DB null to application boolean
        user: portfolio.user ? {
            ...portfolio.user,
            is_admin: portfolio.user.is_admin || false
        } : null
    };

    // Determine if preview banner should be shown
    const isOwner = user && portfolio.user_id === user.id;
    const showPreviewBanner = !portfolio.published && (isOwner || isAdmin);

    return (
        <>
            <PreviewBanner isVisible={showPreviewBanner} />
            <PortfolioDetailClient portfolio={portfolioWithRanking as any} user={user} />
        </>
    );
}