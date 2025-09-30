import { createClient } from "@/lib/supabase";
import { PortfolioWithRelations } from "@/types";
import { AuthChangeEvent, Session, User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";

interface UsePortfolioOverviewProps {
    portfolio: PortfolioWithRelations;
    initialUser: User | null;
}

export function usePortfolioOverview({ portfolio, initialUser }: UsePortfolioOverviewProps) {
    const [user, setUser] = useState<User | null>(initialUser);
    const [isUpvoting, setIsUpvoting] = useState(false);
    const [hasCompletedFeedback, setHasCompletedFeedback] = useState(false);
    const [isAdminUser, setIsAdminUser] = useState(false);
    const [upvoteCount, setUpvoteCount] = useState(0);
    const [supabase] = useState(() => createClient());

    // User state management
    useEffect(() => {
        async function getUser() {
            try {
                // SECURE: Use getUser() to validate authenticity (consistent with other hooks)
                const { data: { user }, error } = await supabase.auth.getUser();
                if (error) {
                    // Handle AuthSessionMissingError as normal "not logged in" state
                    if (error.message?.includes('Auth session missing') || error.name === 'AuthSessionMissingError') {
                        setUser(null);
                        return;
                    }
                    console.error('Error getting user:', error);
                    setUser(null);
                    return;
                }
                setUser(user);
            } catch (err: any) {
                // Handle AuthSessionMissingError as normal "not logged in" state
                if (err.message?.includes('Auth session missing') || err.name === 'AuthSessionMissingError') {
                    setUser(null);
                } else {
                    console.error('Exception in getUser:', err);
                    setUser(null);
                }
            }
        }
        getUser();

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
            setUser(session?.user ?? null);
        });

        return () => subscription.unsubscribe();
    }, [supabase]);

    // Check if user is admin
    useEffect(() => {
        async function checkAdminStatus() {
            if (!user) {
                setIsAdminUser(false);
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('profiles')
                    .select('is_admin')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error('Error checking admin status:', error);
                    return;
                }

                setIsAdminUser(data?.is_admin || false);
            } catch (err) {
                console.error('Exception checking admin status:', err);
            }
        }

        checkAdminStatus();
    }, [user, supabase]);

    // Feedback status check
    useEffect(() => {
        async function checkFeedbackStatus() {
            if (!user) return;

            if (isAdminUser) {
                setHasCompletedFeedback(false);
                return;
            }

            const { data, error } = await supabase
                .from("feedback_status")
                .select("*")
                .eq("portfolio_id", portfolio.id)
                .eq("user_id", user.id)
                .maybeSingle();

            if (error) {
                console.error('Error checking feedback status:', error);
                return;
            }

                setHasCompletedFeedback((data as any)?.status === 'completed');
        }
        checkFeedbackStatus();
    }, [user, portfolio.id, supabase, isAdminUser]);

    // Upvote count management
    useEffect(() => {
        async function fetchUpvoteCount() {
            const { data, error } = await supabase
                .from("portfolio_upvote_counts")
                .select("upvote_count")
                .eq("portfolio_id", portfolio.id)
                .single();

            if (error) {
                console.error("Error fetching upvote count:", error);
                return;
            }

            setUpvoteCount(data?.upvote_count || 0);
        }

        fetchUpvoteCount();
    }, [portfolio.id, supabase]);

    // Upvote handler with improvements
    const handleUpvote = async () => {
        if (!user) {
            throw new Error("User must be logged in to upvote");
        }

        // Optimistic update
        setUpvoteCount(prev => prev + 1);

        try {
            setIsUpvoting(true);

            // Admin bypass - admins can always upvote
            if (isAdminUser) {
                const { error: insertError } = await supabase
                    .from("upvotes")
                    .insert({
                        portfolio_id: portfolio.id,
                        user_id: user.id,
                    })
                    .select()
                    .single();

                if (insertError) {
                    if (insertError.code === '23505') { // unique_violation
                        // Rollback optimistic update
                        setUpvoteCount(prev => prev - 1);
                        return { alreadyUpvoted: true };
                    }
                    throw new Error("Failed to insert admin upvote");
                }

                return { success: true };
            }

            // For non-admin users, use upsert to handle race conditions
            const { error: upsertError } = await supabase
                .from("upvotes")
                .upsert({
                    portfolio_id: portfolio.id,
                    user_id: user.id,
                }, {
                    onConflict: 'portfolio_id,user_id'
                })
                .select()
                .single();

            if (upsertError) {
                if (upsertError.code === '23505') { // unique_violation
                    // Rollback optimistic update
                    setUpvoteCount(prev => prev - 1);
                    return { alreadyUpvoted: true };
                }
                throw new Error("Failed to insert upvote");
            }

            return { success: true };
        } catch (error) {
            // Rollback optimistic update on error
            setUpvoteCount(prev => prev - 1);
            console.error("Error in handleUpvote:", error);
            throw error;
        } finally {
            setIsUpvoting(false);
        }
    };

    return {
        user,
        isUpvoting,
        hasCompletedFeedback,
        isAdminUser,
        upvoteCount,
        handleUpvote,
    };
} 