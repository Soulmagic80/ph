"use client";

import PortfolioComments from "@/components/portfolio/detail/PortfolioComments";
import PortfolioDetails from "@/components/portfolio/detail/PortfolioDetails";
import PortfolioOverview from "@/components/portfolio/detail/PortfolioOverview";
import PortfolioRating from "@/components/portfolio/detail/PortfolioRating";
import { Divider } from "@/components/ui/Divider";
import { createClient } from "@/lib/supabase";
import { PortfolioWithRelations } from "@/types";
import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface PortfolioDetailClientProps {
    portfolio: PortfolioWithRelations;
    user: User | null;
}

export default function PortfolioDetailClient({ portfolio: initialPortfolio, user }: PortfolioDetailClientProps) {

    const [portfolio, setPortfolio] = useState<PortfolioWithRelations>(initialPortfolio);
    const [_isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = loading, false = not admin, true = admin

    const handleUpvote = () => {
        // Update local state when upvote happens
        setPortfolio(prev => ({
            ...prev,
            upvote_count: (prev.upvote_count || 0) + 1
        }));
    };

    // Check admin status
    useEffect(() => {
        async function checkAdminStatus() {
            if (!user) {
                setIsAdmin(false);
                return;
            }

            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error('Error checking admin status:', error);
                    setIsAdmin(false);
                    return;
                }

                setIsAdmin(data?.is_admin || false);
            } catch (err) {
                console.error('Exception checking admin status:', err);
                setIsAdmin(false);
            }
        }

        checkAdminStatus();
    }, [user]);


    return (
        <>
            <main className="max-w-7xl px-5 md:px-10 py-10 mx-auto bg-white dark:bg-gray-900 mt-20">
                <div className="space-y-14 pb-20">
                    <PortfolioOverview portfolio={portfolio} user={user} onUpvote={handleUpvote} />
                    <Divider />
                    <PortfolioDetails portfolio={portfolio} />
                    <Divider />
                    <PortfolioRating portfolio={portfolio} />
                    <Divider />
                    <PortfolioComments portfolio_id={portfolio.id} user={user} />
                </div>
            </main>
        </>
    );
} 