"use client";
import { supabase } from "@/lib/supabase";
import { Comment } from "@/types";
import { ChatCircle } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import CommentCard from "./CommentCard";

interface PortfolioCommentsProps {
    portfolio_id: string;
}

export default function PortfolioComments({ portfolio_id }: PortfolioCommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);

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
                // First get the comments
                const { data: commentsData, error: commentsError } = await supabase
                    .from("portfolio_comments")
                    .select("*")
                    .eq("portfolio_id", portfolio_id)
                    .order("created_at", { ascending: false });

                if (commentsError) {
                    console.error("Error fetching comments:", commentsError);
                    return;
                }

                // Then get the user profiles for these comments
                if (commentsData && commentsData.length > 0) {
                    const userIds = commentsData.map(comment => comment.user_id);
                    const { data: profilesData, error: profilesError } = await supabase
                        .from("profiles")
                        .select("id, username, avatar_url")
                        .in("id", userIds);

                    if (profilesError) {
                        console.error("Error fetching profiles:", profilesError);
                        return;
                    }

                    // Combine the data
                    const commentsWithProfiles = commentsData.map(comment => ({
                        ...comment,
                        user: profilesData?.find(profile => profile.id === comment.user_id)
                    }));

                    if (isMounted) {
                        console.log("Setting comments with profiles:", commentsWithProfiles);
                        setComments(commentsWithProfiles);
                    }
                } else {
                    if (isMounted) {
                        setComments([]);
                    }
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
    }, [portfolio_id]);

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
                    {loading ? (
                        <div className="text-gray-500">Loading comments...</div>
                    ) : comments.length === 0 ? (
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
                            {comments.map((comment) => (
                                <CommentCard
                                    key={comment.id}
                                    avatarSrc={comment.user?.avatar_url || ""}
                                    avatarFallback={comment.user?.username ? comment.user.username.slice(0, 2).toUpperCase() : "?"}
                                    name={comment.user?.username || "Unknown"}
                                    timeAgo={new Date(comment.created_at).toLocaleDateString()}
                                    comment={comment.content}
                                    role={undefined}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 