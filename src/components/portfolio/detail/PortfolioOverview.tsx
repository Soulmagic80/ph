"use client";

import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/Dialog";
import { createClient } from "@/lib/supabase/client";
import { isAdmin } from "@/utils/isAdmin";
import { ArrowUpCircleIcon, StarIcon } from "@heroicons/react/24/solid";
import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PortfolioOverviewProps {
    title: string;
    images: string[];
    portfolioId: string;
    user: User | null;
    onUpvote?: () => void;
}

const supabase = createClient();

export default function PortfolioOverview({ title, images, portfolioId, user: initialUser, onUpvote }: PortfolioOverviewProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isUpvoting, setIsUpvoting] = useState(false);
    const [hasRated, setHasRated] = useState(false);
    const [isRatingModalOpen, setIsRatingModalOpen] = useState(false);
    const [isUpvoteModalOpen, setIsUpvoteModalOpen] = useState(false);
    const [user, setUser] = useState<User | null>(initialUser);

    useEffect(() => {
        async function getUser() {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) {
                    console.error('Error getting session:', error);
                    setUser(null);
                    return;
                }
                if (session?.user) {
                    setUser(session.user);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error('Exception in getUser:', err);
                setUser(null);
            }
        }
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            console.log('Auth state changed:', _event);
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        async function checkIfUserHasRated() {
            if (!user) {
                console.log('No user logged in');
                setHasRated(false);
                return;
            }

            console.log('Checking if user has rated:', {
                portfolioId,
                userId: user.id,
                userEmail: user.email
            });

            try {
                const { data, error } = await supabase.rpc('has_user_rated_portfolio', {
                    p_portfolio_id: portfolioId,
                    p_user_id: user.id
                });

                console.log('Rating check result:', { data, error });

                if (error) {
                    console.error('Error checking rating:', error);
                    setHasRated(false);
                    return;
                }

                if (data) {
                    console.log('User has already rated this portfolio');
                    setHasRated(true);
                } else {
                    console.log('User has not rated this portfolio yet');
                    setHasRated(false);
                }
            } catch (err) {
                console.error('Exception in checkIfUserHasRated:', err);
                setHasRated(false);
            }
        }

        checkIfUserHasRated();
    }, [portfolioId, user]);

    const handleUpvote = async () => {
        if (!user) {
            alert("Please log in to upvote");
            return;
        }

        setIsUpvoting(true);
        try {
            console.log("Upvote clicked, user:", user.email);

            // Check if user is admin (zentral)
            if (await isAdmin(user.id)) {
                // Admin: Directly increment upvotes
                const { error: incrementError } = await supabase
                    .rpc('increment_portfolio_upvotes', {
                        p_portfolio_id: portfolioId
                    });

                if (incrementError) {
                    console.error("Error incrementing upvotes:", incrementError);
                    return;
                }

                if (onUpvote) {
                    onUpvote();
                }
                // Nach Admin-Upvote returnen!
                return;
            }

            // Normal user: Check for existing upvote
            const { data: existingUpvote, error: checkError } = await supabase
                .from("portfolio_upvotes")
                .select("id")
                .eq("portfolio_id", portfolioId)
                .eq("user_id", user.id)
                .single();

            if (checkError && checkError.code !== 'PGRST116') {
                alert("Failed to check if you've already upvoted");
                return;
            }

            if (existingUpvote) {
                console.log("User has already upvoted this portfolio");
                setIsUpvoteModalOpen(true);
                return;
            }

            // Add new upvote
            const { error: insertError } = await supabase
                .from("portfolio_upvotes")
                .insert({ portfolio_id: portfolioId, user_id: user.id });

            if (insertError) {
                alert("Failed to record your upvote");
                return;
            }

            // Fetch updated upvotes count
            const { error: fetchError } = await supabase
                .from("portfolios")
                .select("upvotes")
                .eq("id", portfolioId)
                .single();

            if (fetchError) {
                console.error("Error fetching updated upvotes:", fetchError);
                return;
            }

            if (onUpvote) {
                onUpvote();
            }
        } catch (error) {
            console.error("Error in handleUpvote:", error);
        } finally {
            setIsUpvoting(false);
        }
    };

    const handleRateClick = (e: React.MouseEvent) => {
        console.log('Rate button clicked, hasRated:', hasRated, 'user:', user?.email);
        if (hasRated) {
            e.preventDefault();
            e.stopPropagation();
            setIsRatingModalOpen(true);
            return false;
        }
    };

    return (
        <section aria-labelledby="portfolio-overview-heading">
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                {/* Left column: Title and subtitle */}
                <div>
                    <h2
                        id="portfolio-overview-heading"
                        className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
                    >
                        Portfolio Overview
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        View and interact with this portfolio. You can upvote, rate, or visit the website.
                    </p>
                </div>
                {/* Right column: Content */}
                <div className="md:col-span-2 md:pl-16">
                    <div className="bg-white dark:bg-gray-900 rounded-md border border-gray-200 p-6 dark:border-gray-800">
                        <div className="w-full">
                            <div className="aspect-[500/300] w-full flex gap-4">
                                {/* Hauptbild */}
                                <div className="flex-1 h-full">
                                    <div className="rounded-md h-full border border-gray-200 dark:border-gray-800">
                                        {images[selectedImageIndex] ? (
                                            <Image
                                                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio-images/${images[selectedImageIndex]}`}
                                                alt={title}
                                                width={500}
                                                height={300}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-50 dark:bg-gray-800 rounded-md flex items-center justify-center">
                                                <span className="text-gray-400 dark:text-gray-600">No image available</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Thumbnails */}
                                <div className="flex flex-col gap-4 w-[20%] h-full">
                                    {[0, 1, 2, 3].map((index) => (
                                        <div
                                            key={index}
                                            className={`w-full h-[calc((100%-48px)/4)] rounded-md cursor-pointer transition-all border border-gray-200 dark:border-gray-800 ${selectedImageIndex === index
                                                ? 'outline outline-2 outline-blue-500 outline-offset-2'
                                                : 'bg-gray-50 dark:bg-gray-800'
                                                }`}
                                            onClick={() => setSelectedImageIndex(index)}
                                        >
                                            {images[index] && (
                                                <Image
                                                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio-images/${images[index]}`}
                                                    alt={`${title} - Image ${index + 1}`}
                                                    width={120}
                                                    height={72}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className="w-full mt-8 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-sm dark:bg-blue-600 dark:hover:bg-blue-700">
                                Visit website
                            </button>
                            <div className="flex flex-col lg:flex-row gap-2 mt-4">
                                {user ? (
                                    <button
                                        onClick={handleUpvote}
                                        disabled={isUpvoting}
                                        className={`flex-1 flex items-center justify-center gap-2 bg-white text-gray-900 py-2 px-4 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors text-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700 ${isUpvoting ? 'opacity-50 cursor-not-allowed' : ''}`}
                                    >
                                        <ArrowUpCircleIcon className="w-5 h-5" />
                                        <span>{isUpvoting ? 'Upvoting...' : 'Upvote this portfolio'}</span>
                                    </button>
                                ) : (
                                    <Link href="/login" className="flex-1">
                                        <button className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 py-2 px-4 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors text-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700">
                                            <ArrowUpCircleIcon className="w-5 h-5" />
                                            <span>Upvote this portfolio</span>
                                        </button>
                                    </Link>
                                )}
                                {hasRated ? (
                                    <button
                                        onClick={() => setIsRatingModalOpen(true)}
                                        className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-900 py-2 px-4 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors text-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700"
                                    >
                                        <StarIcon className="w-5 h-5" />
                                        <span>Rate this portfolio</span>
                                    </button>
                                ) : user ? (
                                    <Link
                                        href={`/feedback/${portfolioId}/info`}
                                        passHref
                                        className="flex-1"
                                        onClick={handleRateClick}
                                    >
                                        <button className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 py-2 px-4 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors text-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700">
                                            <StarIcon className="w-5 h-5" />
                                            <span>Rate this portfolio</span>
                                        </button>
                                    </Link>
                                ) : (
                                    <Link href="/login" className="flex-1">
                                        <button className="w-full flex items-center justify-center gap-2 bg-white text-gray-900 py-2 px-4 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors text-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700">
                                            <StarIcon className="w-5 h-5" />
                                            <span>Rate this portfolio</span>
                                        </button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upvote Modal */}
            <Dialog open={isUpvoteModalOpen} onOpenChange={setIsUpvoteModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Already Upvoted</DialogTitle>
                        <DialogDescription className="mt-1 text-sm leading-6">
                            You have already upvoted this portfolio. Each portfolio can only be upvoted once.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6">
                        <Button
                            variant="primary"
                            className="mt-2 w-full sm:mt-0 sm:w-fit bg-[#3474DB] hover:bg-[#2B5FB3] dark:bg-[#3474DB] dark:hover:bg-[#2B5FB3]"
                            onClick={() => setIsUpvoteModalOpen(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Rating Modal */}
            <Dialog open={isRatingModalOpen} onOpenChange={setIsRatingModalOpen}>
                <DialogContent className="sm:max-w-lg">
                    <DialogHeader>
                        <DialogTitle>Already Rated</DialogTitle>
                        <DialogDescription className="mt-1 text-sm leading-6">
                            You have already rated this portfolio. Each portfolio can only be rated once.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter className="mt-6">
                        <Button
                            variant="primary"
                            className="mt-2 w-full sm:mt-0 sm:w-fit bg-[#3474DB] hover:bg-[#2B5FB3] dark:bg-[#3474DB] dark:hover:bg-[#2B5FB3]"
                            onClick={() => setIsRatingModalOpen(false)}
                        >
                            Close
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </section>
    );
} 