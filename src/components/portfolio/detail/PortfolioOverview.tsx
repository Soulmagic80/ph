"use client";

import { useUpvote } from "@/hooks/portfolio/useUpvote";
import { getPortfolioImageUrl, normalizeWebsiteUrl } from "@/lib/imageUtils";
import { createClient } from "@/lib/supabase";
import { PortfolioWithRelations } from "@/types";
import { ArrowUpCircleIcon, StarIcon } from "@heroicons/react/24/solid";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PortfolioOverviewProps {
    portfolio: PortfolioWithRelations;
    user: User | null;
    onUpvote?: () => void;
}

export default function PortfolioOverview({ portfolio, user: initialUser, onUpvote }: PortfolioOverviewProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const [isAdmin, setIsAdmin] = useState(false);
    const [hasCompletedFeedback, setHasCompletedFeedback] = useState(false);
    const router = useRouter();
    const [supabase] = useState(() => createClient());
    
    // Check if the current user is the portfolio owner
    const isOwner = initialUser?.id === portfolio.user_id;

    useEffect(() => {
        async function checkAdminStatus() {
            if (!initialUser) {
                setIsAdmin(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('id', initialUser.id)
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
    }, [initialUser, supabase]);

    useEffect(() => {
        async function checkFeedbackStatus() {
            if (!initialUser) return;
            if (isAdmin) {
                setHasCompletedFeedback(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from("feedback_status")
                    .select("*")
                    .eq("portfolio_id", portfolio.id)
                    .eq("user_id", initialUser.id)
                    .maybeSingle();

                if (error) {
                    console.error('Error checking feedback status:', error);
                    return;
                }

                setHasCompletedFeedback((data as any)?.status === 'completed');
            } catch (err) {
                console.error('Exception checking feedback status:', err);
            }
        }

        checkFeedbackStatus();
    }, [initialUser, portfolio.id, supabase, isAdmin]);

    const { upvoteCount, isUpvoted, isLoading: isUpvoting, toggleUpvote } = useUpvote({
        portfolioId: portfolio.id,
        userId: initialUser?.id ?? null,
        initialUpvoteCount: portfolio.upvote_count ?? 0,
        isAdmin
    });

    const handleUpvoteClick = async () => {
        if (!initialUser) {
            router.push("/auth/login");
            return;
        }

        // Prevent owner from upvoting their own portfolio
        if (isOwner) {
            toast.info("You cannot upvote your own portfolio");
            return;
        }

        try {
            if (!isAdmin && isUpvoted) {
                toast.info("You have already upvoted this portfolio");
                return;
            }

            await toggleUpvote();
            if (onUpvote) {
                onUpvote();
            }
        } catch (error) {
            console.error("Error handling upvote:", error);
        }
    };

    const handleRateClick = () => {
        if (!initialUser) {
            router.push("/auth/login");
            return;
        }

        // Prevent owner from rating their own portfolio
        if (isOwner) {
            toast.info("You cannot rate your own portfolio");
            return;
        }

        if (!isAdmin && hasCompletedFeedback) {
            toast.info("You have already provided feedback for this portfolio");
            return;
        }

        router.push(`/feedback/${portfolio.id}/info`);
    };

    return (
        <section aria-labelledby="portfolio-overview-heading">
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                {/* Left column: Title and subtitle */}
                <div>
                    <h2
                        id="portfolio-overview-heading"
                        className="heading-section scroll-mt-10"
                    >
                        Portfolio Overview
                    </h2>
                    <p className="text-small mt-2">
                        View and interact with this portfolio. You can upvote, rate, or visit the website.
                    </p>
                </div>
                {/* Right column: Content */}
                <div className="md:col-span-2 md:pl-16">
                    <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 p-6 dark:border-gray-800">
                        <div className="w-full">
                            {/* Desktop: Side by side, Mobile: Stacked */}
                            <div className="w-full flex flex-col xl:flex-row gap-4">
                                {/* Main image - 3:2 aspect ratio */}
                                <div className="flex-1">
                                    <div className="aspect-[3/2] w-full rounded-md border border-gray-200 dark:border-gray-800">
                                        {portfolio.images?.[selectedImageIndex] ? (
                                            <Image
                                                src={getPortfolioImageUrl(portfolio.id, portfolio.images[selectedImageIndex])}
                                                alt={portfolio.title}
                                                width={520}
                                                height={347}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-50 dark:bg-gray-800 rounded-md flex items-center justify-center">
                                                <span className="text-gray-400 dark:text-gray-600">No image available</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Thumbnails - responsive layout */}
                                <div className="w-full xl:w-[17%]">
                                    {/* Mobile: Full width grid */}
                                    <div className="grid grid-cols-4 gap-3 xl:hidden">
                                        {[0, 1, 2, 3].map((index) => (
                                            <div
                                                key={index}
                                                className={`w-full aspect-[3/2] rounded-md cursor-pointer transition-all border border-gray-200 dark:border-gray-800 ${selectedImageIndex === index
                                                    ? 'outline outline-2 outline-blue-500 outline-offset-1'
                                                    : 'bg-gray-50 dark:bg-gray-900'
                                                    }`}
                                                onClick={() => setSelectedImageIndex(index)}
                                            >
                                                {portfolio.images?.[index] ? (
                                                    <Image
                                                        src={getPortfolioImageUrl(portfolio.id, portfolio.images[index])}
                                                        alt={`${portfolio.title} - Image ${index + 1}`}
                                                        width={120}
                                                        height={80}
                                                        className="w-full h-full object-cover rounded-md"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-md"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    {/* Desktop: Vertical column */}
                                    <div className="hidden xl:flex flex-col gap-3 h-full">
                                        {[0, 1, 2, 3].map((index) => (
                                            <div
                                                key={index}
                                                className={`w-full flex-1 aspect-[3/2] rounded-md cursor-pointer transition-all border border-gray-200 dark:border-gray-800 ${selectedImageIndex === index
                                                    ? 'outline outline-2 outline-blue-500 outline-offset-1'
                                                    : 'bg-gray-50 dark:bg-gray-900'
                                                    }`}
                                                onClick={() => setSelectedImageIndex(index)}
                                            >
                                                {portfolio.images?.[index] ? (
                                                    <Image
                                                        src={getPortfolioImageUrl(portfolio.id, portfolio.images[index])}
                                                        alt={`${portfolio.title} - Image ${index + 1}`}
                                                        width={120}
                                                        height={80}
                                                        className="w-full h-full object-cover rounded-md"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-md"></div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            {portfolio.website_url && (
                                <Link
                                    href={normalizeWebsiteUrl(portfolio.website_url || '')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full mt-8 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-sm dark:bg-blue-600 dark:hover:bg-blue-700 text-center"
                                >
                                    Visit website
                                </Link>
                            )}
                            <div className="flex flex-col lg:flex-row gap-2 mt-4">
                                {initialUser ? (
                                    <button
                                        onClick={handleUpvoteClick}
                                        disabled={isUpvoting}
                                        className={`flex-1 flex items-center justify-center gap-2 bg-white text-gray-900 py-2 px-4 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors text-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700/50 dark:hover:bg-gray-850 ${isUpvoting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <ArrowUpCircleIcon className="w-5 h-5" />
                                        <span>{isUpvoting ? 'Upvoting...' : `Upvote (${upvoteCount})`}</span>
                                    </button>
                                ) : (
                                    <Link href="/auth/login" className="flex-1">
                                        <button className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 py-2 px-4 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors text-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700/50 dark:hover:bg-gray-850">
                                            <ArrowUpCircleIcon className="w-5 h-5" />
                                            <span>Upvote this portfolio</span>
                                        </button>
                                    </Link>
                                )}
                                <button
                                    onClick={handleRateClick}
                                    className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-900 py-2 px-4 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors text-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700/50 dark:hover:bg-gray-850"
                                >
                                    <StarIcon className="w-5 h-5" />
                                    <span>Rate this portfolio</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </section>
    );
} 