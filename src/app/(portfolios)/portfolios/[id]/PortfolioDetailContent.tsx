"use client";

import { Divider } from "@/components/Divider";
import PortfolioComments from "@/components/portfolio/PortfolioComments";
import PortfolioDetails from "@/components/portfolio/PortfolioDetails";
import PortfolioOverview from "@/components/portfolio/PortfolioOverview";
import PortfolioRating from "@/components/portfolio/PortfolioRating";
import { supabase } from "@/lib/supabase";
import { PortfolioWithRelations } from "@/types";
import { useEffect, useState } from "react";

export default function PortfolioDetailContent({ id }: { id: string }) {
    const [portfolio, setPortfolio] = useState<PortfolioWithRelations | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchPortfolio() {
            try {
                setLoading(true);
                setError(null);

                const { data: portfolioData, error: portfolioError } = await supabase
                    .from('portfolios')
                    .select(`
                        *,
                        services:portfolio_services(service:services(*)),
                        tools:portfolio_tools(tool:tools(*)),
                        portfolio_rating:portfolio_rating(
                            id,
                            is_positive,
                            user_id,
                            feedback_chip:feedback_chips(*)
                        ),
                        portfolio_rating_counts:portfolio_rating_counts(
                            id,
                            count,
                            feedback_chip:feedback_chips(*)
                        )
                    `)
                    .eq('id', id)
                    .single();

                if (portfolioError) {
                    console.error('Error fetching portfolio:', portfolioError);
                    setError(portfolioError.message);
                    return;
                }

                if (!portfolioData) {
                    setError('Portfolio not found');
                    return;
                }

                const { data: profileData, error: profileError } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', portfolioData.user_id)
                    .maybeSingle();

                if (profileError) {
                    console.error('Error fetching profile:', profileError);
                    setError(profileError.message);
                    return;
                }

                const combinedData = {
                    ...portfolioData,
                    user: profileData || null
                };

                setPortfolio(combinedData);
            } catch (error) {
                console.error('Error fetching portfolio:', error);
                setError('An unexpected error occurred');
            } finally {
                setLoading(false);
            }
        }

        fetchPortfolio();
    }, [id]);

    if (loading) {
        return (
            <div className="max-w-7x mx-auto px-5 md:px-10 py-10 mt-20">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-4"></div>
                    <div className="h-64 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-7xl mx-auto px-5 md:px-10 py-10 mt-20">
                <div className="text-red-500 dark:text-red-400">
                    {error}
                </div>
            </div>
        );
    }

    if (!portfolio) {
        return (
            <div className="max-w-7xl mx-auto px-5 md:px-10 py-10 mt-20">
                <div className="text-gray-500 dark:text-gray-400">
                    Portfolio not found
                </div>
            </div>
        );
    }

    const imageUrls = portfolio.images?.map(image =>
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio-images/${image}`
    ) || [];

    return (
        <main className="max-w-7xl mx-auto px-5 md:px-10 py-10 mt-20 bg-white dark:bg-gray-950 min-h-screen">
            <div className="space-y-12">
                <PortfolioOverview
                    title={portfolio.title}
                    images={imageUrls}
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