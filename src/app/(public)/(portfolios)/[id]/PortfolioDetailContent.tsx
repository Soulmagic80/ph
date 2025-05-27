"use client";

import PortfolioComments from "@/components/portfolio/detail/PortfolioComments";
import PortfolioDetails from "@/components/portfolio/detail/PortfolioDetails";
import PortfolioOverview from "@/components/portfolio/detail/PortfolioOverview";
import PortfolioRating from "@/components/portfolio/detail/PortfolioRating";
import { Divider } from "@/components/ui/Divider";
import { supabase } from "@/lib/supabase";
import { PortfolioWithRelations } from "@/types";
import { User } from "@supabase/supabase-js";
import { useState } from "react";

interface PortfolioDetailContentProps {
    portfolio: PortfolioWithRelations;
    user: User | null;
}

export default function PortfolioDetailContent({ portfolio: initialPortfolio, user }: PortfolioDetailContentProps) {
    const [portfolio, setPortfolio] = useState<PortfolioWithRelations>(initialPortfolio);

    const handleUpvote = async () => {
        const { data: updatedPortfolio } = await supabase
            .from("portfolios")
            .select("*")
            .eq("id", portfolio.id)
            .single();

        if (updatedPortfolio) {
            setPortfolio(prev => ({
                ...prev,
                upvotes: updatedPortfolio.upvotes
            }));
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
                <PortfolioComments portfolio_id={portfolio.id} />
            </div>
        </main>
    );
} 