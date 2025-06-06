import { createServerSupabaseClient } from '@/lib/supabase/server';
import { notFound } from "next/navigation";
import PortfolioDetailContent from "./PortfolioDetailContent";

interface PageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function Page({ params }: PageProps) {
    try {
        // Resolve params first
        const resolvedParams = await params;
        const id = resolvedParams.id;

        if (!id) {
            console.error("No portfolio ID provided");
            notFound();
        }

        // Initialize Supabase client with the new SSR package (new signature)
        const supabase = createServerSupabaseClient();

        // Get portfolio with relations
        const { data: portfolio, error } = await supabase
            .from("portfolios")
            .select(`
                *,
                portfolio_feedback_process (
                    id,
                    user_id,
                    portfolio_id,
                    created_at
                ),
                portfolio_upvotes (
                    id,
                    user_id,
                    portfolio_id,
                    created_at
                ),
                portfolio_rating_counts (
                    count,
                    feedback_chip:feedback_chips (
                        id,
                        name,
                        type,
                        icon_name,
                        category,
                        short_description
                    )
                ),
                tools:portfolio_tools (
                    tool:tools (
                        id,
                        name
                    )
                ),
                services:portfolio_services (
                    service:services (
                        id,
                        name
                    )
                )
            `)
            .eq("id", id)
            .single();

        if (error || !portfolio) {
            console.error("Error fetching portfolio:", error);
            notFound();
        }

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        return <PortfolioDetailContent portfolio={portfolio} user={user} />;
    } catch (error) {
        console.error("Error in portfolio page:", error);
        notFound();
    }
} 