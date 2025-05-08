"use client";

import Approvers from "@/app/user/profile/_components/Approvers";
import AuditRules from "@/app/user/profile/_components/AuditRules";
import TransactionPolicy from "@/app/user/profile/_components/TransactionPolicy";
import { Divider } from "@/components/Divider";
import PortfolioDetails from "@/components/portfolio/PortfolioDetails";
import PortfolioOverview from "@/components/portfolio/PortfolioOverview";
import { supabase } from "@/lib/supabase";
import { Portfolio } from "@/types";
import { useEffect, useState } from "react";

export default function PortfolioDetailPage({ params }: { params: { id: string } }) {
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPortfolio() {
            try {
                const { data, error } = await supabase
                    .from('portfolios')
                    .select('*')
                    .eq('id', params.id)
                    .single();

                if (error) throw error;
                setPortfolio(data);
            } catch (error) {
                console.error('Error fetching portfolio:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchPortfolio();
    }, [params.id, Date.now()]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!portfolio) {
        return <div>Portfolio not found</div>;
    }

    // Bild-URLs aus Storage
    const imageUrls = portfolio.images?.map(image =>
        `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio-images/${image}`
    ) || [];

    return (
        <main className="max-w-7xl mx-auto px-5 md:px-10 py-10 mt-16">
            <PortfolioOverview
                title={portfolio.title}
                images={imageUrls}
            />
            <Divider className="my-10" />
            <PortfolioDetails
                portfolio={portfolio}
            />
            {/* Restliche Komponenten */}
            <AuditRules />
            <Divider className="my-10" />
            <Approvers />
            <Divider className="my-10" />
            <TransactionPolicy />
        </main>
    );
} 