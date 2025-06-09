"use client";
import CommentCard from "@/components/feedback/ui/CommentCard";
import { Divider } from "@/components/ui/Divider";
import { createClient } from "@/lib/supabase/client";
import { Comment as BaseComment } from "@/types";
import { ChatCircle } from "@phosphor-icons/react";
import { User } from "@supabase/supabase-js";
import { Button, Textarea } from "@tremor/react";
import React, { useEffect, useState } from "react";

interface PortfolioCommentsProps {
    portfolio_id: string;
    user: User | null;
}

// Typ für Kommentare mit Votes
type CommentWithVotes = BaseComment & {
    upvotes: number;
    downvotes: number;
};

export interface Comment {
    // ... deine bisherigen Felder
    upvotes?: number;
    downvotes?: number;
}

export default function PortfolioComments({ portfolio_id, user }: PortfolioCommentsProps) {
    const [comments, setComments] = useState<CommentWithVotes[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [replyToParent, setReplyToParent] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [supabase] = useState(() => createClient());
    const [editId, setEditId] = useState<string | null>(null);
    const [editContent, setEditContent] = useState("");

    async function fetchComments(showLoading = true) {
        if (!portfolio_id) {
            console.error("No portfolio_id provided");
            return;
        }
        if (showLoading) setLoading(true);
        try {
            const { data: commentsData, error: commentsError } = await supabase
                .from("portfolio_comments")
                .select(`
                    *,
                    user:profiles(id, username, avatar_url)
                `)
                .eq("portfolio_id", portfolio_id)
                .order("created_at", { ascending: false });

            if (commentsError) {
                console.error("Error fetching comments:", commentsError);
                return;
            }

            // Votes laden
            const commentIds = (commentsData || []).map((c: BaseComment) => c.id);
            const { data: votesData, error: votesError } = await supabase
                .from("portfolio_comment_votes")
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
                if (vote.vote_type === "up") voteCounts[vote.comment_id].up += 1;
                if (vote.vote_type === "down") voteCounts[vote.comment_id].down += 1;
            }

            // Votes an die Kommentare anhängen
            const commentsWithVotes = (commentsData || []).map((c: BaseComment) => ({
                ...c,
                upvotes: voteCounts[c.id]?.up ?? 0,
                downvotes: voteCounts[c.id]?.down ?? 0,
            }));

            setComments(commentsWithVotes);
        } catch (err) {
            console.error("Exception while fetching comments:", err);
        } finally {
            if (showLoading) setLoading(false);
        }
    }

    useEffect(() => {
        fetchComments(true);
    }, [portfolio_id, supabase]);

    // Hilfsfunktionen für Gruppierung
    const topLevelComments = comments.filter(c => !c.parent_id);
    const replies = comments.filter(c => c.parent_id);
    const getReplies = (parentId: string) => replies.filter(r => r.parent_id === parentId);

    function getTopLevelParentId(comment: CommentWithVotes) {
        return comment.parent_id ? comment.parent_id : comment.id;
    }

    // Neuen Hauptkommentar absenden
    async function handleNewCommentSubmit(e: React.MouseEvent) {
        e.preventDefault();
        e.stopPropagation();

        if (!newComment.trim() || !user) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase.from("portfolio_comments").insert({
                portfolio_id,
                user_id: user.id,
                content: newComment,
                parent_id: null,
            });

            if (error) throw error;

            // Kommentare neu laden, aber ohne globales loading
            fetchComments(false);
            setNewComment(""); // Formular zurücksetzen
        } catch (error) {
            console.error("Error posting comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    // Antwort absenden
    async function handleReplySubmit(e?: React.MouseEvent) {
        if (e) {
            e.preventDefault();
            e.stopPropagation();
        }

        if (!replyContent.trim() || !user || !replyToParent) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase.from("portfolio_comments").insert({
                portfolio_id,
                user_id: user.id,
                content: replyContent,
                parent_id: replyToParent,
            });

            if (error) throw error;

            fetchComments(false);
            setReplyContent("");
            setReplyTo(null);
            setReplyToParent(null);
        } catch (error) {
            console.error("Error posting reply:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    async function handleVote(commentId: string, voteType: "up" | "down") {
        if (!user) {
            alert("Bitte einloggen, um abzustimmen.");
            return;
        }

        // Optimistisches Update
        setComments(prev => prev.map(c => {
            if (c.id !== commentId) return c;
            let up = c.upvotes || 0;
            let down = c.downvotes || 0;
            if (voteType === "up") up += 1;
            else down += 1;
            return { ...c, upvotes: up, downvotes: down };
        }));

        // Prüfe, ob der User schon gevotet hat
        const { data: existingVote, error } = await supabase
            .from("portfolio_comment_votes")
            .select("*")
            .eq("comment_id", commentId)
            .eq("user_id", user.id)
            .maybeSingle();

        if (error) {
            alert("Fehler beim Prüfen des Votes.");
            return;
        }

        if (existingVote) {
            if (existingVote.vote_type === voteType) {
                return;
            }
            await supabase
                .from("portfolio_comment_votes")
                .update({ vote_type: voteType, updated_at: new Date().toISOString() })
                .eq("id", existingVote.id);
        } else {
            await supabase
                .from("portfolio_comment_votes")
                .insert({
                    comment_id: commentId,
                    user_id: user.id,
                    vote_type: voteType,
                });
        }
        fetchComments(false);
    }

    const handleReplyClick = (comment: CommentWithVotes) => {
        setReplyTo(comment.id);
        setReplyToParent(getTopLevelParentId(comment));
    };

    const handleEditStart = (id: string) => {
        setEditId(id);
        const comment = comments.find(c => c.id === id);
        if (comment) {
            setEditContent(comment.content);
        }
    };

    const handleEditCancel = () => {
        setEditId(null);
        setEditContent("");
    };

    const handleEditSave = async (id: string) => {
        if (!user) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from("portfolio_comments")
                .update({ content: editContent })
                .eq("id", id);

            if (error) throw error;

            fetchComments(false);
            setEditId(null);
            setEditContent("");
        } catch (error) {
            console.error("Error editing comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!user) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase
                .from("portfolio_comments")
                .delete()
                .eq("id", id);

            if (error) throw error;

            fetchComments(false);
        } catch (error) {
            console.error("Error deleting comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="w-full mt-10" style={{ minHeight: 400, overflow: "visible" }}>
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                {/* Left side - Title and subtitle */}
                <div>
                    <h2 className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50">Portfolio Comments</h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Share your thoughts and feedback about this portfolio
                    </p>
                </div>
                {/* Right side - Comments Section */}
                <div className="md:col-span-2 md:pl-16">
                    <div className="flex items-center gap-3 mb-6">
                        <ChatCircle size={16} weight="fill" className="text-gray-500" />
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">What others are saying</h3>
                    </div>

                    {/* New Comment Form */}
                    {user && (
                        <div className="mb-8">
                            <div className="bg-white dark:bg-gray-950 rounded-md border border-gray-200 dark:border-gray-800 flex flex-col gap-3 p-4 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                                <Textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    rows={3}
                                    className="mb-0 border-none focus:ring-0 resize-none bg-transparent text-sm p-0"
                                />
                                <div className="flex items-center justify-end gap-4">
                                    <Button
                                        type="button"
                                        size="xs"
                                        variant="light"
                                        onClick={() => setNewComment("")}
                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        size="xs"
                                        className="rounded-md bg-[#3474DB] hover:bg-[#2B5FB3] text-white border-0 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
                                        disabled={!newComment.trim() || isSubmitting}
                                        onClick={handleNewCommentSubmit}
                                    >
                                        {isSubmitting ? "Posting..." : "Submit"}
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {loading ? (
                        <div className="text-gray-500">Loading comments...</div>
                    ) : topLevelComments.length === 0 ? (
                        <CommentCard
                            avatarSrc=""
                            avatarFallback="U"
                            name="User"
                            timeAgo={new Date().toLocaleDateString()}
                            comment="No comments yet."
                        />
                    ) : (
                        <div className="space-y-3">
                            {topLevelComments.map((comment, idx) => (
                                <React.Fragment key={comment.id}>
                                    <div>
                                        <CommentCard
                                            avatarSrc={comment.user?.avatar_url || ""}
                                            avatarFallback={comment.user?.username ? comment.user.username.slice(0, 2).toUpperCase() : "?"}
                                            name={comment.user?.username || "Unknown"}
                                            timeAgo={new Date(comment.created_at).toLocaleDateString()}
                                            comment={comment.content}
                                            upvotes={comment.upvotes}
                                            downvotes={comment.downvotes}
                                            onUpvote={() => handleVote(comment.id, "up")}
                                            onDownvote={() => handleVote(comment.id, "down")}
                                            onReply={() => handleReplyClick(comment)}
                                            currentUserId={user?.id || null}
                                            userId={comment.user_id}
                                            onEdit={() => handleEditStart(comment.id)}
                                            onDelete={() => handleDelete(comment.id)}
                                            onReport={() => alert("Report coming soon!")}
                                        />
                                        {/* Reply-Feld für Top-Level-Kommentar */}
                                        {user && replyTo === comment.id && (
                                            <form
                                                onSubmit={(e) => e.preventDefault()}
                                                className="bg-white dark:bg-gray-950 rounded-md border border-gray-200 dark:border-gray-800 flex flex-col gap-3 p-4 mt-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
                                            >
                                                <Textarea
                                                    value={replyContent}
                                                    onChange={e => setReplyContent(e.target.value)}
                                                    placeholder="Write a reply..."
                                                    rows={2}
                                                    className="mb-0 border-none focus:ring-0 resize-none bg-transparent text-sm p-0"
                                                />
                                                <div className="flex items-center justify-end gap-4">
                                                    <Button
                                                        type="button"
                                                        size="xs"
                                                        className="rounded-md bg-[#3474DB] hover:bg-[#2B5FB3] text-white border-0 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
                                                        disabled={!replyContent.trim() || isSubmitting}
                                                        onClick={handleReplySubmit}
                                                    >
                                                        {isSubmitting ? "Posting..." : "Reply"}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        size="xs"
                                                        variant="light"
                                                        onClick={() => setReplyTo(null)}
                                                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </div>
                                            </form>
                                        )}
                                        <div className="ml-8 mt-2 space-y-2">
                                            {getReplies(comment.id).map((reply) => (
                                                <div key={reply.id}>
                                                    {editId === reply.id ? (
                                                        <div className="bg-white dark:bg-gray-950 rounded-md border border-gray-200 dark:border-gray-800 flex flex-col gap-3 p-4 mt-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                                                            <Textarea
                                                                value={editContent}
                                                                onChange={e => setEditContent(e.target.value)}
                                                                rows={2}
                                                                className="mb-0 border-none focus:ring-0 resize-none bg-transparent text-sm p-0"
                                                            />
                                                            <div className="flex items-center justify-end gap-4">
                                                                <Button
                                                                    type="button"
                                                                    size="xs"
                                                                    variant="light"
                                                                    onClick={handleEditCancel}
                                                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    size="xs"
                                                                    className="rounded-md bg-[#3474DB] hover:bg-[#2B5FB3] text-white border-0"
                                                                    disabled={!editContent.trim() || isSubmitting}
                                                                    onClick={() => handleEditSave(reply.id)}
                                                                >
                                                                    {isSubmitting ? "Saving..." : "Save"}
                                                                </Button>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        <CommentCard
                                                            avatarSrc={reply.user?.avatar_url || ""}
                                                            avatarFallback={reply.user?.username ? reply.user.username.slice(0, 2).toUpperCase() : "?"}
                                                            name={reply.user?.username || "Unknown"}
                                                            timeAgo={new Date(reply.created_at).toLocaleDateString()}
                                                            comment={reply.content}
                                                            upvotes={reply.upvotes}
                                                            downvotes={reply.downvotes}
                                                            onUpvote={() => handleVote(reply.id, "up")}
                                                            onDownvote={() => handleVote(reply.id, "down")}
                                                            onReply={() => handleReplyClick(reply)}
                                                            currentUserId={user?.id || null}
                                                            userId={reply.user_id}
                                                            onEdit={() => handleEditStart(reply.id)}
                                                            onDelete={() => handleDelete(reply.id)}
                                                            onReport={() => alert("Report coming soon!")}
                                                        />
                                                    )}
                                                    {/* Reply-Feld für Reply */}
                                                    {user && replyTo === reply.id && (
                                                        <form
                                                            onSubmit={(e) => e.preventDefault()}
                                                            className="bg-white dark:bg-gray-950 rounded-md border border-gray-200 dark:border-gray-800 flex flex-col gap-3 p-4 mt-2 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent"
                                                        >
                                                            <Textarea
                                                                value={replyContent}
                                                                onChange={e => setReplyContent(e.target.value)}
                                                                placeholder="Write a reply..."
                                                                rows={2}
                                                                className="mb-0 border-none focus:ring-0 resize-none bg-transparent text-sm p-0"
                                                            />
                                                            <div className="flex items-center justify-end gap-4">
                                                                <Button
                                                                    type="button"
                                                                    size="xs"
                                                                    className="rounded-md bg-[#3474DB] hover:bg-[#2B5FB3] text-white border-0 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
                                                                    disabled={!replyContent.trim() || isSubmitting}
                                                                    onClick={handleReplySubmit}
                                                                >
                                                                    {isSubmitting ? "Posting..." : "Reply"}
                                                                </Button>
                                                                <Button
                                                                    type="button"
                                                                    size="xs"
                                                                    variant="light"
                                                                    onClick={() => setReplyTo(null)}
                                                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                                                >
                                                                    Cancel
                                                                </Button>
                                                            </div>
                                                        </form>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {idx < topLevelComments.length - 1 && <Divider />}
                                </React.Fragment>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}