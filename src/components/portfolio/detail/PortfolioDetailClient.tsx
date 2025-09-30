"use client";

import PortfolioComments from "@/components/portfolio/detail/PortfolioComments";
import PortfolioDetails from "@/components/portfolio/detail/PortfolioDetails";
import PortfolioOverview from "@/components/portfolio/detail/PortfolioOverview";
import PortfolioRating from "@/components/portfolio/detail/PortfolioRating";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { createClient } from "@/lib/supabase";
import { PortfolioWithRelations } from "@/types";
import { User } from "@supabase/supabase-js";
import { Eye, X } from "lucide-react";
import { useEffect, useState } from "react";

interface PortfolioDetailClientProps {
    portfolio: PortfolioWithRelations;
    user: User | null;
}

export default function PortfolioDetailClient({ portfolio: initialPortfolio, user }: PortfolioDetailClientProps) {
    const [portfolio, setPortfolio] = useState<PortfolioWithRelations>(initialPortfolio);
    const [isAdmin, setIsAdmin] = useState(false);

    // Test log to confirm this component is loading
    console.log('🚀 PortfolioDetailClient loaded!');

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
                    return;
                }

                setIsAdmin(data?.is_admin || false);
            } catch (err) {
                console.error('Exception checking admin status:', err);
            }
        }

        checkAdminStatus();
    }, [user]);

    // Check if this is a preview (draft portfolio being viewed by owner or admin)
    const isPreview = portfolio.status === 'draft' && user && (portfolio.user_id === user.id || isAdmin);

    // Debug info (commented out for production)
    // console.log('Preview Debug:', { portfolioStatus: portfolio.status, isPreview });

    return (
        <>
            {/* Preview Info Bar */}
            {isPreview && (
                <div className="fixed top-0 left-0 right-0 z-50 bg-pink-100 dark:bg-pinkdark-200 text-white shadow-lg">
                    <div className="max-w-7xl mx-auto px-5 md:px-10">
                        <div className="flex h-16 items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <Eye className="h-5 w-5" />
                                <div>
                                    <span className="font-medium">Preview Mode</span>
                                    <span className="ml-2 text-gray-200 dark:text-gray-300">
                                        This is how your portfolio will look to visitors
                                    </span>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Button
                                    variant="secondary"
                                    className="bg-white/10 hover:bg-white/20 text-white border-white/20 px-3 py-1.5 text-sm dark:bg-white/20 dark:hover:bg-white/30"
                                    onClick={() => window.close()}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Close Preview
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <main className={`max-w-7xl mx-auto px-5 md:px-10 py-10 space-y-14 ${isPreview ? 'mt-16' : 'mt-20'}`}>
                <PortfolioOverview portfolio={portfolio} user={user} onUpvote={handleUpvote} />
                <Divider />
                <PortfolioDetails portfolio={portfolio} />
                <Divider />
                <PortfolioRating portfolio={portfolio} />
                <Divider />
                <PortfolioComments portfolio_id={portfolio.id} user={user} />
            </main>
        </>
    );
} 