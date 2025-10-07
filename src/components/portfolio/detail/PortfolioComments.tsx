"use client";

import { useCommentActions } from "@/hooks/portfolio/useCommentActions";
import { createClient } from "@/lib/supabase";
import { Comment as BaseComment } from "@/types";
import { ChatCircleDots } from "@phosphor-icons/react";
import { User } from "@supabase/supabase-js";
import React, { useCallback, useEffect, useState } from "react";
import CommentForm from "./CommentForm";
import CommentsList from "./CommentsList";

interface PortfolioCommentsProps {
    portfolio_id: string;
    user: User | null;
}

// Removed unused CommentWithUser interface - using DB types directly

// Typ für Kommentare mit Votes
type CommentWithVotes = BaseComment & {
    upvotes: number;
    downvotes: number;
    username: string;
    avatar_url: string | null;
    is_admin: boolean;
};

export interface Comment {
    // ... deine bisherigen Felder
    upvotes?: number;
    downvotes?: number;
}

export default function PortfolioComments({ portfolio_id, user }: PortfolioCommentsProps) {
    const [comments, setComments] = useState<CommentWithVotes[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyToId, setReplyToId] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [newComment, setNewComment] = useState("");
    const [supabase] = useState(() => createClient());
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");

    const fetchComments = useCallback(async (showLoading = true) => {
        if (!portfolio_id) {
            console.error("No portfolio_id provided");
            return;
        }
        if (showLoading) setLoading(true);
        try {
            const { data: commentsData, error: commentsError } = await supabase
                .from("comments_with_users")
                .select("*")
                .eq("portfolio_id", portfolio_id)
                .order("created_at", { ascending: false });

            if (commentsError) {
                console.error("Error fetching comments:", commentsError);
                return;
            }

            // Votes laden
            const commentIds = (commentsData || []).map((c: any) => c.id);
            const { data: votesData, error: votesError } = await supabase
                .from("comment_votes")
                .select("comment_id, vote_type")
                .in("comment_id", commentIds);

            if (votesError) {
                console.error("Error fetching votes:", votesError);
            }

            // Votes pro Kommentar zählen
            const voteCounts: Record<string, { up: number; down: number }> = {};
            for (const id of commentIds) {
                voteCounts[id] = { up: 0, down: 0 };
            }
            for (const vote of votesData || []) {
                if (vote.vote_type === "up") {
                    voteCounts[vote.comment_id].up++;
                } else if (vote.vote_type === "down") {
                    voteCounts[vote.comment_id].down++;
                }
            }

            const commentsWithVotes: CommentWithVotes[] = (commentsData || []).map((comment: any) => ({
                ...comment,
                upvotes: voteCounts[comment.id]?.up || 0,
                downvotes: voteCounts[comment.id]?.down || 0,
            }));

            setComments(commentsWithVotes);
        } catch (err) {
            console.error("Exception while fetching comments:", err);
        } finally {
            if (showLoading) setLoading(false);
        }
    }, [portfolio_id, supabase]);

    useEffect(() => {
        fetchComments(true);
    }, [fetchComments]);

    // Use the custom hook for all comment actions
    const {
        handleNewCommentSubmit,
        handleReplySubmit,
        handleEditSave,
        handleDelete,
        handleVote,
        isSubmitting
    } = useCommentActions({
        portfolioId: portfolio_id,
        user,
        comments,
        setComments,
        onRefresh: fetchComments
    });

    // Handler functions for the UI components
    const handleNewCommentSubmitWrapper = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const success = await handleNewCommentSubmit(newComment);
        if (success) {
            setNewComment("");
        }
    };

    const handleReplyClick = (comment: CommentWithVotes) => {
        setReplyToId(comment.id);
    };

    const handleReplyCancel = () => {
        setReplyToId(null);
        setReplyContent("");
    };

    const handleEditStart = (id: string) => {
        setEditingId(id);
        const comment = comments.find(c => c.id === id);
        if (comment) {
            setEditContent(comment.content);
        }
    };

    const handleEditCancel = () => {
        setEditingId(null);
        setEditContent("");
    };

    const handleEditSaveWrapper = async (id: string) => {
        const success = await handleEditSave(id, editContent);
        if (success) {
            setEditingId(null);
            setEditContent("");
        }
    };

    return (
        <section aria-labelledby="comments-heading">
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                {/* Left Column - Title & Description */}
                <div>
                    <h2
                        id="comments-heading"
                        className="heading-section scroll-mt-10"
                    >
                        Portfolio Comments
                    </h2>
                    <p className="text-small">
                        Share your thoughts and feedback about this portfolio
                    </p>
                </div>

                {/* Right Column - Content */}
                <div className="md:col-span-2 md:pl-16">
                    <div className="flex items-center gap-3 mb-6">
                        <ChatCircleDots size={16} weight="fill" className="text-gray-500" />
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">What others are saying</h3>
                    </div>

                    {/* New Comment Form */}
                    <CommentForm
                        user={user}
                        value={newComment}
                        onChange={setNewComment}
                        onSubmit={handleNewCommentSubmitWrapper}
                        isSubmitting={isSubmitting}
                    />

                    {/* Comments List */}
                    <CommentsList
                        comments={comments}
                        user={user}
                        loading={loading}
                        replyToId={replyToId}
                        replyContent={replyContent}
                        onReplyContentChange={setReplyContent}
                        onReplySubmit={handleReplySubmit}
                        onReplyClick={handleReplyClick}
                        onReplyCancel={handleReplyCancel}
                        editingId={editingId}
                        editContent={editContent}
                        onEditStart={handleEditStart}
                        onEditCancel={handleEditCancel}
                        onEditSave={handleEditSaveWrapper}
                        onEditContentChange={setEditContent}
                        onDelete={handleDelete}
                        onVote={handleVote}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        </section>
    );
}