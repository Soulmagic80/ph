import { EmptyState } from "@/components/ui/EmptyState";
import PulsatingDots from "@/components/ui/PulsatingDots";

interface PortfolioStatesProps {
    isLoading: boolean;
    hasMore: boolean;
    portfoliosLength: number;
    loadMoreRef?: (node: HTMLDivElement | null) => void;
}

export function PortfolioStates({ isLoading, hasMore, portfoliosLength, loadMoreRef }: PortfolioStatesProps) {

    return (
        <>
            {isLoading && portfoliosLength === 0 && (
                <div className="flex justify-center py-32">
                    <div className="text-center">
                        <PulsatingDots size={2} />
                        <p className="text-gray-500 dark:text-gray-400 mt-4">Loading portfolios...</p>
                    </div>
                </div>
            )}

            {isLoading && portfoliosLength > 0 && (
                <div className="flex justify-center py-8">
                    <PulsatingDots size={1} />
                </div>
            )}

            {!isLoading && hasMore && (
                <div ref={loadMoreRef} className="h-20" />
            )}

            {!isLoading && !hasMore && portfoliosLength > 0 && (
                <div className="relative mt-16">
                    {/* Content */}
                    <div className="relative flex flex-col items-center justify-center py-12 px-6">
                        {/* Icon */}
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                            <svg className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>

                        {/* Text */}
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">
                            You&apos;ve seen it all!
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
                            You&apos;ve reached the end of our portfolio collection. Check back soon for new submissions!
                        </p>

                        {/* Decorative element */}
                        <div className="mt-6 flex space-x-1">
                            <div className="h-1 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                            <div className="h-1 w-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                            <div className="h-1 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                        </div>
                    </div>
                </div>
            )}

            {!isLoading && portfoliosLength === 0 && (
                <EmptyState
                    title="No portfolios found"
                    description="Select another filter or check back later."
                />
            )}
        </>
    );
} 