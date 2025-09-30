import { createClient } from "@/lib/supabase";
import { useEffect, useState } from "react";

interface UseUpvoteProps {
    portfolioId: string;
    userId: string | null;
    initialUpvoteCount: number;
    isAdmin?: boolean;
}

export function useUpvote({ portfolioId, userId, initialUpvoteCount, isAdmin = false }: UseUpvoteProps) {
    const [upvoteCount, setUpvoteCount] = useState(initialUpvoteCount);
    const [isUpvoted, setIsUpvoted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    // Initial load of upvote count and status
    useEffect(() => {
        const loadUpvoteData = async () => {
            try {
                // Get current upvote count using the safe function
                const { data: currentData } = await supabase
                    .rpc('get_portfolio_upvote_count', { p_portfolio_id: portfolioId });

                if (currentData !== null) {
                    setUpvoteCount(currentData || 0);
                }

                // Only check user's vote status if they are logged in
                if (userId && !isAdmin) {
                    const { data: voteData, error: voteError } = await supabase
                        .from('upvotes')
                        .select('id')
                        .match({
                            portfolio_id: portfolioId,
                            user_id: userId
                        })
                        .limit(1);

                    if (voteError) {
                        console.error('Error checking user vote:', voteError);
                        return;
                    }

                    setIsUpvoted(voteData && voteData.length > 0);
                }
            } catch (err) {
                console.error('Error in loadUpvoteData:', err);
            }
        };

        loadUpvoteData();
    }, [portfolioId, userId, isAdmin, supabase]);

    // Toggle upvote
    const toggleUpvote = async () => {
        if (!userId) {
            setError('Please log in to upvote');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            if (isAdmin) {
                // For admins: Always add a new upvote
                const { error: insertError } = await supabase
                    .from('upvotes')
                    .insert({
                        portfolio_id: portfolioId,
                        user_id: userId
                    });

                if (insertError) throw insertError;
                setUpvoteCount(prev => prev + 1);
            } else {
                // For normal users: Toggle upvote
                const { data: existingVotes, error: checkError } = await supabase
                    .from('upvotes')
                    .select('id')
                    .match({
                        portfolio_id: portfolioId,
                        user_id: userId
                    })
                    .limit(1);

                if (checkError) throw checkError;

                if (existingVotes && existingVotes.length > 0) {
                    // Remove upvote
                    const { error: deleteError } = await supabase
                        .from('upvotes')
                        .delete()
                        .match({
                            portfolio_id: portfolioId,
                            user_id: userId
                        });

                    if (deleteError) throw deleteError;
                    setUpvoteCount(prev => prev - 1);
                    setIsUpvoted(false);
                } else {
                    // Add upvote
                    const { error: insertError } = await supabase
                        .from('upvotes')
                        .insert({
                            portfolio_id: portfolioId,
                            user_id: userId
                        });

                    if (insertError) throw insertError;
                    setUpvoteCount(prev => prev + 1);
                    setIsUpvoted(true);
                }
            }

            // Fetch the latest upvote count using the safe function
            const { data: latestData } = await supabase
                .rpc('get_portfolio_upvote_count', { p_portfolio_id: portfolioId });

            if (latestData !== null) {
                setUpvoteCount(latestData || 0);
            }
        } catch (err) {
            // Rollback on error
            setUpvoteCount(initialUpvoteCount);
            if (!isAdmin) {
                setIsUpvoted(!isUpvoted);
            }
            setError(err instanceof Error ? err.message : 'Failed to update upvote');
            console.error('Error in toggleUpvote:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        upvoteCount,
        isUpvoted,
        isLoading,
        error,
        toggleUpvote
    };
} 