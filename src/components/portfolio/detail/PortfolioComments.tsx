"use client";
import CommentCard from "@/components/feedback/ui/CommentCard";
import { createClient } from "@/lib/supabase/client";
import { Comment } from "@/types";
import { ChatCircle } from "@phosphor-icons/react";
import { User } from "@supabase/supabase-js";
import { Button, Textarea } from "@tremor/react";
import { useEffect, useState } from "react";

interface PortfolioCommentsProps {
    portfolio_id: string;
    user: User | null;
}

export default function PortfolioComments({ portfolio_id, user }: PortfolioCommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [replyTo, setReplyTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState("");
    const [newComment, setNewComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        let isMounted = true;

        async function fetchComments() {
            if (!portfolio_id) {
                console.error("No portfolio_id provided");
                return;
            }

            console.log("Fetching comments for portfolio:", portfolio_id);
            setLoading(true);

            try {
                // Get comments with user profiles in a single query
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

                if (isMounted) {
                    console.log("Setting comments:", commentsData);
                    setComments(commentsData || []);
                }
            } catch (err) {
                console.error("Exception while fetching comments:", err);
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        fetchComments();

        return () => {
            isMounted = false;
        };
    }, [portfolio_id, supabase]);

    // Hilfsfunktionen für Gruppierung
    const topLevelComments = comments.filter(c => !c.parent_id);
    const replies = comments.filter(c => c.parent_id);
    const getReplies = (parentId: string) => replies.filter(r => r.parent_id === parentId);

    // Neuen Hauptkommentar absenden
    async function handleNewCommentSubmit(e: React.FormEvent) {
        e.preventDefault();
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

            // Kommentare neu laden
            const { data: commentsData, error: reloadError } = await supabase
                .from("portfolio_comments")
                .select(`
                    *,
                    user:profiles(id, username, avatar_url)
                `)
                .eq("portfolio_id", portfolio_id)
                .order("created_at", { ascending: false });

            if (reloadError) throw reloadError;
            setComments(commentsData || []);
            setNewComment(""); // Formular zurücksetzen
        } catch (error) {
            console.error("Error posting comment:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    // Antwort absenden
    async function handleReplySubmit(parentId: string) {
        if (!replyContent.trim() || !user) return;

        setIsSubmitting(true);
        try {
            const { error } = await supabase.from("portfolio_comments").insert({
                portfolio_id,
                user_id: user.id,
                content: replyContent,
                parent_id: parentId,
            });

            if (error) throw error;

            // Kommentare neu laden
            const { data: commentsData, error: reloadError } = await supabase
                .from("portfolio_comments")
                .select(`
                    *,
                    user:profiles(id, username, avatar_url)
                `)
                .eq("portfolio_id", portfolio_id)
                .order("created_at", { ascending: false });

            if (reloadError) throw reloadError;
            setComments(commentsData || []);
            setReplyContent("");
            setReplyTo(null);
        } catch (error) {
            console.error("Error posting reply:", error);
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="w-full mt-10">
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
                        <form onSubmit={handleNewCommentSubmit} className="mb-8">
                            <div className="bg-white dark:bg-gray-950 rounded-md border border-gray-200 dark:border-gray-800 flex flex-col gap-3 p-4 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                                <Textarea
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    placeholder="Write a comment..."
                                    rows={3}
                                    className="mb-0 border-none focus:ring-0 resize-none bg-transparent text-sm p-0"
                                />
                                <div className="flex items-center justify-end">
                                    <Button
                                        type="submit"
                                        size="xs"
                                        className="rounded-md bg-[#3474DB] hover:bg-[#2B5FB3] text-white border-0 disabled:bg-gray-100 disabled:text-gray-400 disabled:border-gray-200"
                                        disabled={!newComment.trim() || isSubmitting}
                                    >
                                        {isSubmitting ? "Posting..." : "Submit"}
                                    </Button>
                                </div>
                            </div>
                        </form>
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
                            role="User"
                        />
                    ) : (
                        <div className="space-y-3">
                            {topLevelComments.map((comment) => (
                                <div key={comment.id}>
                                    <CommentCard
                                        avatarSrc={comment.user?.avatar_url || ""}
                                        avatarFallback={comment.user?.username ? comment.user.username.slice(0, 2).toUpperCase() : "?"}
                                        name={comment.user?.username || "Unknown"}
                                        timeAgo={new Date(comment.created_at).toLocaleDateString()}
                                        comment={comment.content}
                                        role={undefined}
                                    />
                                    <div className="ml-8 mt-2 space-y-2">
                                        {getReplies(comment.id).map((reply) => (
                                            <CommentCard
                                                key={reply.id}
                                                avatarSrc={reply.user?.avatar_url || ""}
                                                avatarFallback={reply.user?.username ? reply.user.username.slice(0, 2).toUpperCase() : "?"}
                                                name={reply.user?.username || "Unknown"}
                                                timeAgo={new Date(reply.created_at).toLocaleDateString()}
                                                comment={reply.content}
                                                role={undefined}
                                            />
                                        ))}
                                        {user && (
                                            <div>
                                                {replyTo === comment.id ? (
                                                    <form
                                                        onSubmit={e => {
                                                            e.preventDefault();
                                                            handleReplySubmit(comment.id);
                                                        }}
                                                        className="flex flex-col gap-2 mt-2"
                                                    >
                                                        <Textarea
                                                            value={replyContent}
                                                            onChange={e => setReplyContent(e.target.value)}
                                                            placeholder="Write a reply..."
                                                            rows={2}
                                                        />
                                                        <div className="flex gap-2">
                                                            <Button
                                                                type="submit"
                                                                size="xs"
                                                                disabled={!replyContent.trim() || isSubmitting}
                                                            >
                                                                {isSubmitting ? "Posting..." : "Reply"}
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                size="xs"
                                                                variant="light"
                                                                onClick={() => setReplyTo(null)}
                                                            >
                                                                Cancel
                                                            </Button>
                                                        </div>
                                                    </form>
                                                ) : (
                                                    <Button
                                                        size="xs"
                                                        variant="light"
                                                        onClick={() => setReplyTo(comment.id)}
                                                    >
                                                        Reply
                                                    </Button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}