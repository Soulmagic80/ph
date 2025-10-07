"use client";
import FeedbackDisplayChip from "@/components/feedback/ui/FeedbackDisplayChip";
import { PortfolioWithRelations } from "@/types";
import * as PhosphorIcons from "@phosphor-icons/react";

interface PortfolioRatingProps {
    portfolio: PortfolioWithRelations;
}

export default function PortfolioRating({ portfolio }: PortfolioRatingProps) {
    // Use the new materialized view data (already sorted by DB)
    const ratingSummary = portfolio.portfolio_rating_summary || [];

    // Get top positive and negative ratings (already sorted by rank_in_type)
    const positiveChips = ratingSummary
        .filter((rating) => rating.type === 'positive' && rating.rank_in_type <= 4);

    const negativeChips = ratingSummary
        .filter((rating) => rating.type === 'negative' && rating.rank_in_type <= 2);

    return (
        <>
            <div className="w-full mt-10">
                <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                    {/* Left side - Title and subtitle */}
                    <div>
                        <h2 className="heading-section scroll-mt-10">Portfolio Rating</h2>
                        <p className="text-small mt-2">
                            Rate this portfolio and help others evaluate its quality and features.
                        </p>
                    </div>

                    {/* Right side - Rating Chips */}
                    <div className="md:col-span-2 md:pl-16">
                        <div className="flex flex-col gap-4">
                            {/* Positive Ratings */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50 flex items-center gap-3">
                                    <PhosphorIcons.Heart className="w-4 h-4 text-red-500" weight="fill" />
                                    What the community loves
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                                    {positiveChips.length > 0 ? (
                                        positiveChips.map((rating, index) => (
                                            <FeedbackDisplayChip
                                                key={index}
                                                iconName={rating.icon_name}
                                                title={rating.name}
                                                category={rating.category}
                                                description={rating.short_description}
                                                count={rating.count}
                                            />
                                        ))
                                    ) : (
                                        <div className="flex items-center gap-2 pl-2 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
                                            <div className="p-1.5 rounded-md bg-gray-50 dark:bg-gray-800/50">
                                                <PhosphorIcons.Heart className="w-4 h-4 text-gray-600 dark:text-gray-300" weight="fill" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-geist font-normal text-gray-900 dark:text-white">No feedback yet</span>
                                                <span className="text-xs font-geist text-gray-500 dark:text-gray-400">0 votes</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Negative Ratings */}
                            <div className="mt-10">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50 flex items-center gap-3">
                                    <PhosphorIcons.Screwdriver className="w-4 h-4 text-blue-500" weight="fill" />
                                    What the community thinks could be even better
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-6">
                                    {negativeChips.length > 0 ? (
                                        negativeChips.map((rating, index) => (
                                            <FeedbackDisplayChip
                                                key={index}
                                                iconName={rating.icon_name}
                                                title={rating.name}
                                                category={rating.category}
                                                description={rating.short_description}
                                                count={rating.count}
                                            />
                                        ))
                                    ) : (
                                        <div className="flex items-center gap-2 pl-2 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
                                            <div className="p-1.5 rounded-md bg-gray-50 dark:bg-gray-800/50">
                                                <PhosphorIcons.Screwdriver className="w-4 h-4 text-gray-600 dark:text-gray-300" weight="fill" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-geist font-normal text-gray-900 dark:text-white">No feedback yet</span>
                                                <span className="text-xs font-geist text-gray-500 dark:text-gray-400">0 votes</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 