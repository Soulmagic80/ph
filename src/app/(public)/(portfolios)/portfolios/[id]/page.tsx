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

        // Session holen
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
            console.error("Session error:", sessionError);
            return <div>Error loading session</div>;
        }
        const user = session?.user || null;

        // Portfolio mit allen Relationen laden
        const { data: portfolio, error: portfolioError } = await supabase
            .from("portfolios")
            .select(`
                *,
                tools:portfolio_tools(tool:tools(*)),
                services:portfolio_services(service:services(*)),
                comments:portfolio_comments(*),
                portfolio_rating_counts:portfolio_rating_counts(
                    count,
                    feedback_chip:feedback_chips(*)
                ),
                portfolio_rank_history:portfolio_rank_history(*)
            `)
            .eq("id", id)
            .single();

        if (portfolioError) {
            console.error("Error fetching portfolio:", portfolioError);
            return <div>Error loading portfolio</div>;
        }

        if (!portfolio) {
            return <div>Portfolio not found</div>;
        }

        // Bild-URLs aus Storage
        const imageUrls = portfolio.images?.map((image: string) =>
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio-images/${image}`
        ) || [];

        // Portfolio mit korrekten Bild-URLs
        const portfolioWithImageUrls = {
            ...portfolio,
            images: imageUrls
        };

        return <PortfolioDetailContent portfolio={portfolioWithImageUrls} user={user} />;
    } catch (error) {
        console.error("Unexpected error:", error);
        return <div>An unexpected error occurred</div>;
    }
}
