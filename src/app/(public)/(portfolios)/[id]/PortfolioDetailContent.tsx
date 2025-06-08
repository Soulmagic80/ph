// forced redeploy: supabase import check
"use client";

import PortfolioComments from "@/components/portfolio/detail/PortfolioComments";
import PortfolioDetails from "@/components/portfolio/detail/PortfolioDetails";
import PortfolioOverview from "@/components/portfolio/detail/PortfolioOverview";
import PortfolioRating from "@/components/portfolio/detail/PortfolioRating";
import { Divider } from "@/components/ui/Divider";
import { createClient } from "@/lib/supabase/client";
import { PortfolioWithRelations } from "@/types";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface PortfolioDetailContentProps {
    portfolio: PortfolioWithRelations;
    user: User | null;
}

const supabase = createClient();

export default function PortfolioDetailContent({ portfolio: initialPortfolio, user }: PortfolioDetailContentProps) {
    const [portfolio, setPortfolio] = useState<PortfolioWithRelations>(initialPortfolio);

    useEffect(() => {
        // Fetch current upvotes when component mounts
        async function fetchCurrentUpvotes() {
            const { data: currentPortfolio, error } = await supabase
                .from("portfolios")
                .select("*")
                .eq("id", portfolio.id)
                .single();

            if (error) {
                console.error("Error fetching current upvotes:", error);
                return;
            }

            if (currentPortfolio) {
                setPortfolio(prev => ({
                    ...prev,
                    ...currentPortfolio
                }));
            }
        }

        fetchCurrentUpvotes();
    }, [portfolio.id]);

    const handleUpvote = async () => {
        try {
            // Fetch current upvotes count
            const { data: updatedPortfolio, error: fetchError } = await supabase
                .from("portfolios")
                .select("upvotes")
                .eq("id", portfolio.id)
                .single();

            if (fetchError) {
                console.error("Error fetching updated upvotes:", fetchError);
                return;
            }

            if (updatedPortfolio) {
                setPortfolio(prev => ({
                    ...prev,
                    upvotes: updatedPortfolio.upvotes
                }));
            }
        } catch (error) {
            console.error("Error updating upvotes:", error);
        }
    };

    return (
        <main className="max-w-7xl mx-auto px-5 md:px-10 py-10 mt-20 bg-white dark:bg-gray-950 min-h-screen">
            <div className="space-y-12">
                <PortfolioOverview
                    title={portfolio.title}
                    images={portfolio.images || []}
                    portfolioId={portfolio.id}
                    user={user}
                    onUpvote={handleUpvote}
                />
                <Divider />
                <PortfolioDetails portfolio={portfolio} />
                <Divider />
                <PortfolioRating portfolio={portfolio} />
                <Divider />
                <PortfolioComments portfolio_id={portfolio.id} user={user} />
            </div>
        </main>
    );
} 