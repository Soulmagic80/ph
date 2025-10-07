"use client";

import CommentCard from "@/components/feedback/ui/CommentCard";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { Comment as BaseComment } from "@/types";
import { User } from "@supabase/supabase-js";
import React from "react";

// Use the same type as in PortfolioComments
export type CommentWithVotes = BaseComment & {
    upvotes: number;
    downvotes: number;
    username: string;
    avatar_url: string | null;
    is_admin: boolean;
};

interface CommentsListProps {
    comments: CommentWithVotes[];
    user: User | null;
    loading: boolean;
    replyToId: string | null;
    replyContent: string;
    onReplyContentChange: (content: string) => void;
    onReplySubmit: (content: string, parentId: string) => Promise<boolean>;
    onReplyClick: (comment: CommentWithVotes) => void;
    onReplyCancel: () => void;
    editingId: string | null;
    editContent: string;
    onEditContentChange: (content: string) => void;
    onEditStart: (id: string) => void;
    onEditCancel: () => void;
    onEditSave: (id: string) => void;
    onDelete: (id: string) => void;
    onVote: (commentId: string, voteType: 'up' | 'down') => void;
    isSubmitting: boolean;
}

export default function CommentsList({
    comments,
    user,
    loading,
    replyToId,
    replyContent,
    onReplyContentChange,
    onReplySubmit,
    onReplyClick,
    onReplyCancel,
    editingId,
    editContent,
    onEditContentChange,
    onEditStart,
    onEditCancel,
    onEditSave,
    onDelete,
    onVote,
    isSubmitting
}: CommentsListProps) {

    if (loading) {
        return <div className="text-gray-500">Loading comments...</div>;
    }

    // Separate top-level comments from replies
    const topLevelComments = comments.filter(c => !c.parent_id);
    const replies = comments.filter(c => c.parent_id);

    // Helper function to get replies for a specific parent
    const getReplies = (parentId: string) =>
        replies.filter(r => r.parent_id === parentId);

    if (topLevelComments.length === 0) {
        return (
            <CommentCard
                avatarSrc=""
                avatarFallback="U"
                name="User"
                timeAgo={new Date().toLocaleDateString()}
                comment="No comments yet."
            />
        );
    }

    return (
        <div className="space-y-3">
            {topLevelComments.map((comment) => (
                <React.Fragment key={comment.id}>
                    <div>
                        <CommentCard
                            avatarSrc={comment.avatar_url || ""}
                            avatarFallback={comment.username ? comment.username.slice(0, 2).toUpperCase() : "?"}
                            name={comment.username || "Unknown"}
                            fullName={comment.username || undefined}
                            timeAgo={new Date(comment.created_at).toLocaleDateString()}
                            comment={comment.content}
                            upvotes={comment.upvotes}
                            downvotes={comment.downvotes}
                            onUpvote={() => onVote(comment.id, "up")}
                            onDownvote={() => onVote(comment.id, "down")}
                            onReply={() => onReplyClick(comment)}
                            currentUserId={user?.id || null}
                            userId={comment.user_id}
                            onEdit={() => onEditStart(comment.id)}
                            onDelete={() => onDelete(comment.id)}
                            onReport={() => alert("Report coming soon!")}
                            isEditing={editingId === comment.id}
                            editContent={editContent}
                            onEditContentChange={e => onEditContentChange(e.target.value)}
                            onEditSave={() => onEditSave(comment.id)}
                            onEditCancel={onEditCancel}
                            isSubmitting={isSubmitting}
                        />

                        {/* Reply Form for Top-Level Comment */}
                        {user && replyToId === comment.id && (
                            <div className="ml-6 mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-3">
                                <Textarea
                                    value={replyContent}
                                    onChange={e => onReplyContentChange(e.target.value)}
                                    placeholder="Write a reply..."
                                    rows={3}
                                    className="w-full border-gray-300 dark:border-gray-800 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 resize-none"
                                    disabled={isSubmitting}
                                />
                                <div className="flex items-center justify-end gap-2">
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        className="text-sm"
                                        onClick={onReplyCancel}
                                        disabled={isSubmitting}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="primary"
                                        className="text-sm"
                                        disabled={!replyContent.trim() || isSubmitting}
                                        onClick={async () => {
                                            const success = await onReplySubmit(replyContent, comment.id);
                                            if (success) {
                                                onReplyContentChange("");
                                                onReplyCancel();
                                            }
                                        }}
                                    >
                                        {isSubmitting ? "Posting..." : "Reply"}
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* Replies */}
                        <div className="ml-6 mt-3 pl-4 border-l-2 border-gray-200 dark:border-gray-700 space-y-3">
                            {getReplies(comment.id).map((reply) => (
                                <div key={reply.id}>
                                    <CommentCard
                                        avatarSrc={reply.avatar_url || ""}
                                        avatarFallback={reply.username ? reply.username.slice(0, 2).toUpperCase() : "?"}
                                        name={reply.username || "Unknown"}
                                        fullName={reply.username || undefined}
                                        timeAgo={new Date(reply.created_at).toLocaleDateString()}
                                        comment={reply.content}
                                        upvotes={reply.upvotes}
                                        downvotes={reply.downvotes}
                                        onUpvote={() => onVote(reply.id, "up")}
                                        onDownvote={() => onVote(reply.id, "down")}
                                        onReply={() => onReplyClick(reply)}
                                        currentUserId={user?.id || null}
                                        userId={reply.user_id}
                                        onEdit={() => onEditStart(reply.id)}
                                        onDelete={() => onDelete(reply.id)}
                                        onReport={() => alert("Report coming soon!")}
                                        isEditing={editingId === reply.id}
                                        editContent={editContent}
                                        onEditContentChange={e => onEditContentChange(e.target.value)}
                                        onEditSave={() => onEditSave(reply.id)}
                                        onEditCancel={onEditCancel}
                                        isSubmitting={isSubmitting}
                                    />

                                    {/* Reply Form for Reply */}
                                    {user && replyToId === reply.id && (
                                        <div className="mt-3 space-y-3">
                                            <Textarea
                                                value={replyContent}
                                                onChange={e => onReplyContentChange(e.target.value)}
                                                placeholder="Write a reply..."
                                                rows={3}
                                                className="w-full border-gray-300 dark:border-gray-600 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 resize-none"
                                                disabled={isSubmitting}
                                            />
                                            <div className="flex items-center justify-end gap-2">
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    className="text-sm"
                                                    onClick={onReplyCancel}
                                                    disabled={isSubmitting}
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    type="button"
                                                    variant="primary"
                                                    className="text-sm"
                                                    disabled={!replyContent.trim() || isSubmitting}
                                                    onClick={async () => {
                                                        const success = await onReplySubmit(replyContent, comment.id);
                                                        if (success) {
                                                            onReplyContentChange("");
                                                            onReplyCancel();
                                                        }
                                                    }}
                                                >
                                                    {isSubmitting ? "Posting..." : "Reply"}
                                                </Button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </React.Fragment>
            ))}
        </div>
    );
}