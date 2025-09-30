"use client";

import CommentCard from "@/components/feedback/ui/CommentCard";
import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { ArrowBendUpLeft, PencilSimple, ThumbsDown, ThumbsUp, Trash } from "@phosphor-icons/react";
import { User } from "@supabase/supabase-js";

import { Comment as BaseComment } from "@/types";

// Use the same type as in PortfolioComments
type CommentWithVotes = BaseComment & {
    upvotes: number;
    downvotes: number;
    username: string;
    avatar_url: string | null;
    is_admin: boolean;
};

interface CommentItemProps {
    comment: CommentWithVotes;
    user: User | null;
    isEditing: boolean;
    editContent: string;
    isSubmitting: boolean;
    onEditStart: (id: string) => void;
    onEditCancel: () => void;
    onEditSave: (id: string) => void;
    onEditContentChange: (content: string) => void;
    onDelete: (id: string) => void;
    onVote: (commentId: string, voteType: 'up' | 'down') => void;
    onReply: (comment: CommentWithVotes) => void;
    showReplyButton?: boolean;
}

export default function CommentItem({
    comment,
    user,
    isEditing,
    editContent,
    isSubmitting,
    onEditStart,
    onEditCancel,
    onEditSave,
    onEditContentChange,
    onDelete,
    onVote,
    onReply,
    showReplyButton = true
}: CommentItemProps) {
    const canEdit = user && (user.id === comment.user_id);
    const canDelete = user && (user.id === comment.user_id);

    return (
        <div className="space-y-3">
            <CommentCard
                avatarSrc={comment.avatar_url || ''}
                avatarFallback={comment.username?.charAt(0)?.toUpperCase() || 'A'}
                name={comment.username || 'Anonymous'}
                timeAgo={new Date(comment.created_at).toLocaleDateString()}
                comment={comment.content}
                upvotes={comment.upvotes}
                downvotes={comment.downvotes}
            />

            {/* Edit Form */}
            {isEditing && (
                <div className="ml-12 space-y-3 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <Textarea
                        value={editContent}
                        onChange={(e) => onEditContentChange(e.target.value)}
                        rows={3}
                        className="w-full resize-none"
                        disabled={isSubmitting}
                    />
                    <div className="flex gap-2">
                        <Button
                            onClick={() => onEditSave(comment.id)}
                            disabled={!editContent.trim() || isSubmitting}
                            variant="primary"
                        >
                            {isSubmitting ? "Saving..." : "Save"}
                        </Button>
                        <Button
                            onClick={onEditCancel}
                            disabled={isSubmitting}
                            variant="secondary"
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            {user && !isEditing && (
                <div className="ml-12 flex items-center gap-4 text-sm">
                    {/* Vote Buttons */}
                    <div className="flex items-center gap-2">
                        <Button
                            onClick={() => onVote(comment.id, 'up')}
                            variant="ghost"
                            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400"
                        >
                            <ThumbsUp size={14} />
                            <span>{comment.upvotes}</span>
                        </Button>
                        <Button
                            onClick={() => onVote(comment.id, 'down')}
                            variant="ghost"
                            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                            <ThumbsDown size={14} />
                            <span>{comment.downvotes}</span>
                        </Button>
                    </div>

                    {/* Reply Button */}
                    {showReplyButton && (
                        <Button
                            onClick={() => onReply(comment)}
                            variant="ghost"
                            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <ArrowBendUpLeft size={14} />
                            Reply
                        </Button>
                    )}

                    {/* Edit Button */}
                    {canEdit && (
                        <Button
                            onClick={() => onEditStart(comment.id)}
                            variant="ghost"
                            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                        >
                            <PencilSimple size={14} />
                            Edit
                        </Button>
                    )}

                    {/* Delete Button */}
                    {canDelete && (
                        <Button
                            onClick={() => onDelete(comment.id)}
                            variant="ghost"
                            className="flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400"
                        >
                            <Trash size={14} />
                            Delete
                        </Button>
                    )}
                </div>
            )}
        </div>
    );
}
