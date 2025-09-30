"use client";

import { PortfolioGrid } from "@/components/portfolio/grid/PortfolioGrid";
import { Hero } from "@/components/portfolio/home/Hero";
import { PortfolioFilter } from "@/components/portfolio/home/PortfolioFilter";
import { PortfolioStates } from "@/components/portfolio/home/PortfolioStates";
import { usePortfolios } from "@/hooks/portfolio/usePortfolios";
import { Session } from "@supabase/supabase-js";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

interface HomeClientProps {
    initialSession?: Session | null;
}

export default function HomeClient({ initialSession }: HomeClientProps) {
    // Keep parameter to match interface but don&apos;t use it in this component
    void initialSession;
    const {
        portfolios,
        isLoading,
        error,
        hasMore,
        filter,
        handleUpvote,
        handleFilterChange,
        loadMore
    } = usePortfolios();

    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '100px'
    });

    useEffect(() => {
        if (inView && hasMore) {
            loadMore();
        }
    }, [inView, hasMore, loadMore]);

    return (
        <main className="max-w-7xl px-5 md:px-10 pt-12 mx-auto">
            <Hero />
            <PortfolioFilter
                selectedRanking={filter}
                onFilterChange={handleFilterChange}
            />

            <div className="-mt-2 mb-10">
                {/*   <Divider /> */}
            </div>

            {error ? (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-lg">
                    <p className="text-red-700 dark:text-red-300">{error.message}</p>
                </div>
            ) : (
                <>
                    <PortfolioGrid
                        portfolios={portfolios}
                        onUpvote={handleUpvote}
                    />
                    <div className="mb-16 sm:mb-20 lg:mb-24">
                        <PortfolioStates
                            isLoading={isLoading}
                            hasMore={hasMore}
                            portfoliosLength={portfolios.length}
                            loadMoreRef={ref}
                        />
                    </div>
                </>
            )}
        </main>
    );
}
