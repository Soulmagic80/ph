"use client";

import { supabase } from "@/lib/supabase";
import { notFound, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface PortfolioPageProps {
    params: {
        id: string;
    };
}

export default function PortfolioPage({ params }: PortfolioPageProps) {
    const [portfolio, setPortfolio] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function loadPortfolio() {
            try {
                const { data, error } = await supabase
                    .from("portfolios")
                    .select(`
                        *,
                        portfolio_rank_history (
                            rank_all_time,
                            created_at
                        )
                    `)
                    .eq("id", params.id)
                    .single();

                if (error || !data) {
                    notFound();
                }

                setPortfolio(data);
            } catch (error) {
                console.error("Error loading portfolio:", error);
                notFound();
            } finally {
                setLoading(false);
            }
        }

        loadPortfolio();
    }, [params.id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!portfolio) {
        notFound();
    }

    // 10-Tage-Trend berechnen
    const tenDaysAgo = new Date();
    tenDaysAgo.setDate(tenDaysAgo.getDate() - 10);

    const rankHistory = portfolio.portfolio_rank_history
        ?.filter((entry: any) => new Date(entry.created_at) <= tenDaysAgo)
        .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()) || [];

    const oldRank = rankHistory[0]?.rank_all_time;
    const currentRank = portfolio.rank_all_time;
    const rankChange = oldRank && currentRank ? oldRank - currentRank : null;

    // Bild-URL aus Storage oder Fallback
    const imageSrc = portfolio.image
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio-images/${portfolio.image}`
        : portfolio.image_url || null;

    return (
        <main className="w-full mx-auto mt-14">
            <div className="max-w-7xl mx-auto px-5 md:px-10 py-10">
                {/* ...Restlicher Inhalt wie in der aktuellen Detailseite... */}
            </div>
        </main>
    );
} 