"use client";

import { User } from "@supabase/supabase-js";
import React from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";

import { Comment as BaseComment } from "@/types";

// Use the same type as in PortfolioComments
type CommentWithVotes = BaseComment & {
    upvotes: number;
    downvotes: number;
    username: string;
    avatar_url: string | null;
    is_admin: boolean;
};

interface CommentRepliesProps {
    parentComment: CommentWithVotes;
    replies: CommentWithVotes[];
    user: User | null;

    // Reply form state
    isReplyingTo: string | null;
    replyContent: string;
    onReplyContentChange: (content: string) => void;
    onReplySubmit: (content: string, parentId: string) => Promise<boolean>;
    onReplyCancel: () => void;

    // Edit state
    editingId: string | null;
    editContent: string;
    onEditStart: (id: string) => void;
    onEditCancel: () => void;
    onEditSave: (id: string) => void;
    onEditContentChange: (content: string) => void;

    // Actions
    onDelete: (id: string) => void;
    onVote: (commentId: string, voteType: 'up' | 'down') => void;
    onReplyClick: (comment: CommentWithVotes) => void;

    isSubmitting: boolean;
}

export default function CommentReplies({
    parentComment,
    replies,
    user,
    isReplyingTo,
    replyContent,
    onReplyContentChange,
    onReplySubmit,
    onReplyCancel,
    editingId,
    editContent,
    onEditStart,
    onEditCancel,
    onEditSave,
    onEditContentChange,
    onDelete,
    onVote,
    onReplyClick,
    isSubmitting
}: CommentRepliesProps) {

    const handleReplySubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const success = await onReplySubmit(replyContent, parentComment.id);
        if (success) {
            onReplyCancel();
        }
    };

    // Sort replies by creation date (oldest first for replies)
    const sortedReplies = [...replies].sort((a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );

    return (
        <div className="ml-8 mt-4 space-y-4 border-l-2 border-gray-200 dark:border-gray-700 pl-6">
            {/* Render all replies */}
            {sortedReplies.map((reply) => (
                <CommentItem
                    key={reply.id}
                    comment={reply}
                    user={user}
                    isEditing={editingId === reply.id}
                    editContent={editContent}
                    isSubmitting={isSubmitting}
                    onEditStart={onEditStart}
                    onEditCancel={onEditCancel}
                    onEditSave={onEditSave}
                    onEditContentChange={onEditContentChange}
                    onDelete={onDelete}
                    onVote={onVote}
                    onReply={onReplyClick}
                    showReplyButton={false} // Don't show reply button on replies (no nested replies)
                />
            ))}

            {/* Reply Form */}
            {isReplyingTo === parentComment.id && (
                <div className="mt-4">
                    <div className="mb-2 text-sm text-gray-600 dark:text-gray-400">
                        Replying to <span className="font-medium">{parentComment.username}</span>
                    </div>
                    <CommentForm
                        user={user}
                        value={replyContent}
                        onChange={onReplyContentChange}
                        onSubmit={handleReplySubmit}
                        isSubmitting={isSubmitting}
                        placeholder={`Reply to ${parentComment.username}...`}
                        submitText="Post Reply"
                        showIcon={false}
                    />
                    <div className="mt-2">
                        <button
                            onClick={onReplyCancel}
                            className="text-sm text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
