"use client";
import { FeedbackChip } from "@/components/FeedbackChip";
import { PortfolioWithRelations } from "@/types";
import { Heart, Screwdriver } from "@phosphor-icons/react";
import { ThumbsDown, ThumbsUp } from "lucide-react";

interface PortfolioRatingProps {
    portfolio: PortfolioWithRelations;
}

export default function PortfolioRating({ portfolio }: PortfolioRatingProps) {
    // Get all feedback chips and sort by count
    const allFeedback = portfolio.portfolio_rating_counts || [];

    // Separate and sort positive and negative feedback chips
    const positiveChips = allFeedback
        .filter((feedback) => {
            const name = feedback.feedback_chip.name.toLowerCase();
            return !name.includes('slow') &&
                !name.includes('unclear') &&
                !name.includes('missing') &&
                !name.includes('poor') &&
                !name.includes('outdated') &&
                !name.includes('limited');
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 6); // Only show top 6

    const negativeChips = allFeedback
        .filter((feedback) => {
            const name = feedback.feedback_chip.name.toLowerCase();
            return name.includes('slow') ||
                name.includes('unclear') ||
                name.includes('missing') ||
                name.includes('poor') ||
                name.includes('outdated') ||
                name.includes('limited');
        })
        .sort((a, b) => b.count - a.count)
        .slice(0, 3); // Only show top 3

    return (
        <>
            <div className="w-full mt-10">
                <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                    {/* Left side - Title and subtitle */}
                    <div>
                        <h2 className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50">Portfolio Rating</h2>
                        <p className="mt-2 text-sm leading-6 text-gray-500">
                            Rate this portfolio and help others evaluate its quality and features.
                        </p>
                    </div>

                    {/* Right side - Rating Chips */}
                    <div className="md:col-span-2 md:pl-16">
                        <div className="flex flex-col gap-4">
                            {/* Positive Ratings */}
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50 flex items-center gap-3">
                                    <Heart className="w-4 h-4 text-red-500" weight="fill" />
                                    What the community loves
                                </h3>
                                <div className="flex flex-wrap gap-3 mt-6">
                                    {positiveChips.length > 0 ? (
                                        positiveChips.map((feedback, index) => (
                                            <FeedbackChip
                                                key={index}
                                                icon={<ThumbsUp className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                                                text={feedback.feedback_chip.name}
                                                count={feedback.count}
                                            />
                                        ))
                                    ) : (
                                        <div className="flex items-center gap-2 pl-2 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
                                            <div className="p-1.5 rounded-md bg-gray-50 dark:bg-gray-800/50">
                                                <ThumbsUp className="w-4 h-4 text-gray-600 dark:text-gray-300" />
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
                                    <Screwdriver className="w-4 h-4 text-blue-500" weight="fill" />
                                    What could be even better
                                </h3>
                                <div className="flex flex-wrap gap-3 mt-6">
                                    {negativeChips.length > 0 ? (
                                        negativeChips.map((feedback, index) => (
                                            <FeedbackChip
                                                key={index}
                                                icon={<ThumbsDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                                                text={feedback.feedback_chip.name}
                                                count={feedback.count}
                                            />
                                        ))
                                    ) : (
                                        <div className="flex items-center gap-2 pl-2 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
                                            <div className="p-1.5 rounded-md bg-gray-50 dark:bg-gray-800/50">
                                                <ThumbsDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />
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