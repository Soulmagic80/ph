"use client";
import { Heart, Screwdriver } from "@phosphor-icons/react";
import { ThumbsDown, ThumbsUp } from "lucide-react";
import { FeedbackChip } from "./FeedbackChip";

export default function PortfolioRating() {
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
                                    <FeedbackChip
                                        icon={<ThumbsUp className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                                        text="Well structured"
                                        count={42}
                                    />
                                    <FeedbackChip
                                        icon={<ThumbsUp className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                                        text="Creative"
                                        count={38}
                                    />
                                    <FeedbackChip
                                        icon={<ThumbsUp className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                                        text="Professional"
                                        count={35}
                                    />
                                    <FeedbackChip
                                        icon={<ThumbsUp className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                                        text="Responsive layout"
                                        count={31}
                                    />
                                    <FeedbackChip
                                        icon={<ThumbsUp className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                                        text="Good performance"
                                        count={28}
                                    />
                                </div>
                            </div>

                            {/* Negative Ratings */}
                            <div className="mt-10">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50 flex items-center gap-3">
                                    <Screwdriver className="w-4 h-4 text-blue-500" weight="fill" />
                                    What could be even better
                                </h3>
                                <div className="flex flex-wrap gap-3 mt-6">
                                    <FeedbackChip
                                        icon={<ThumbsDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                                        text="Slow loading time"
                                        count={15}
                                    />
                                    <FeedbackChip
                                        icon={<ThumbsDown className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
                                        text="Unclear call-to-actions"
                                        count={12}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
} 