"use client";

import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import { useCallback, useState } from "react";

import { Comment as BaseComment } from "@/types";

// Use the same type as in PortfolioComments
type CommentWithVotes = BaseComment & {
    upvotes: number;
    downvotes: number;
    username: string;
    avatar_url: string | null;
    is_admin: boolean;
};

interface UseCommentActionsProps {
    portfolioId: string;
    user: User | null;
    comments: CommentWithVotes[];
    setComments: React.Dispatch<React.SetStateAction<CommentWithVotes[]>>;
    onRefresh: (showLoading?: boolean) => void;
}

export function useCommentActions({
    portfolioId,
    user,
    comments: _comments,
    setComments,
    onRefresh
}: UseCommentActionsProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const supabase = createClient();

    // Submit new comment
    const handleNewCommentSubmit = useCallback(async (content: string): Promise<boolean> => {
        if (!content.trim() || !user) return false;

        setIsSubmitting(true);
        try {
            const { error } = await supabase.from("comments").insert({
                portfolio_id: portfolioId,
                user_id: user.id,
                content: content.trim(),
                parent_id: null,
            });

            if (error) throw error;
            onRefresh(false);
            return true; // Success
        } catch (error) {
            console.error("Error posting comment:", error);
            return false; // Failure
        } finally {
            setIsSubmitting(false);
        }
    }, [portfolioId, user, supabase, onRefresh]);

    // Submit reply
    const handleReplySubmit = useCallback(async (content: string, parentId: string): Promise<boolean> => {
        if (!content.trim() || !user || !parentId) return false;

        setIsSubmitting(true);
        try {
            const { error } = await supabase.from("comments").insert({
                portfolio_id: portfolioId,
                user_id: user.id,
                content: content.trim(),
                parent_id: parentId,
            });

            if (error) throw error;
            onRefresh(false);
            return true; // Success
        } catch (error) {
            console.error("Error posting reply:", error);
            return false; // Failure
        } finally {
            setIsSubmitting(false);
        }
    }, [portfolioId, user, supabase, onRefresh]);

    // Edit comment
    const handleEditSave = useCallback(async (commentId: string, newContent: string) => {
        if (!user || !newContent.trim()) return;

        setIsSubmitting(true);
        try {
            // Optimistic update
            setComments(prev => prev.map(c =>
                c.id === commentId ? { ...c, content: newContent.trim() } : c
            ));

            const { error } = await supabase
                .from("comments")
                .update({
                    content: newContent.trim(),
                    updated_at: new Date().toISOString()
                })
                .eq("id", commentId);

            if (error) throw error;
            return true; // Success
        } catch (error) {
            console.error("Error editing comment:", error);
            // Revert optimistic update on error
            onRefresh(false);
            return false; // Failure
        } finally {
            setIsSubmitting(false);
        }
    }, [user, supabase, setComments, onRefresh]);

    // Delete comment
    const handleDelete = useCallback(async (commentId: string) => {
        if (!user) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from("comments")
                .delete()
                .eq("id", commentId);

            if (error) throw error;
            onRefresh(false);
            return true; // Success
        } catch (error) {
            console.error("Error deleting comment:", error);
            return false; // Failure
        } finally {
            setIsSubmitting(false);
        }
    }, [user, supabase, onRefresh]);

    // Vote on comment
    const handleVote = useCallback(async (commentId: string, voteType: 'up' | 'down') => {
        if (!user) return;

        try {
            // Check if user already voted
            const { data: existingVote, error } = await supabase
                .from("comment_votes")
                .select("*")
                .eq("comment_id", commentId)
                .eq("user_id", user.id)
                .maybeSingle();

            if (error) {
                console.error("Error checking existing vote:", error);
                return;
            }

            if (existingVote) {
                if (existingVote.vote_type === voteType) {
                    // Same vote type - remove vote
                    await supabase
                        .from("comment_votes")
                        .delete()
                        .eq("id", existingVote.id);
                } else {
                    // Different vote type - update vote
                    await supabase
                        .from("comment_votes")
                        .update({ 
                            vote_type: voteType, 
                            updated_at: new Date().toISOString() 
                        })
                        .eq("id", existingVote.id);
                }
            } else {
                // No existing vote - create new vote
                await supabase
                    .from("comment_votes")
                    .insert({
                        comment_id: commentId,
                        user_id: user.id,
                        vote_type: voteType,
                    });
            }

            onRefresh(false);
        } catch (error) {
            console.error("Error voting on comment:", error);
        }
    }, [user, supabase, onRefresh]);

    return {
        handleNewCommentSubmit,
        handleReplySubmit,
        handleEditSave,
        handleDelete,
        handleVote,
        isSubmitting
    };
}
