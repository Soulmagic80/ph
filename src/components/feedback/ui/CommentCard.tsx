import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Textarea } from "@/components/ui/Textarea";
import { ThumbsDownIcon, ThumbsUpIcon } from "@phosphor-icons/react";
import DOMPurify from "dompurify";
import React from "react";

interface CommentCardProps {
    avatarSrc: string;
    avatarFallback: string;
    name: string;
    fullName?: string;
    timeAgo: string;
    comment: string;
    upvotes?: number;
    downvotes?: number;
    onUpvote?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    onDownvote?: (e: React.MouseEvent<HTMLButtonElement>) => void;
    voteLoading?: boolean;
    onReply?: () => void;
    currentUserId?: string | null;
    userId?: string; // author id
    onEdit?: () => void;
    onDelete?: () => void;
    onReport?: () => void;
    isEditing?: boolean;
    editContent?: string;
    onEditContentChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onEditSave?: () => void;
    onEditCancel?: () => void;
    isSubmitting?: boolean;
}

export default function CommentCard({
    avatarSrc,
    avatarFallback,
    name,
    fullName,
    timeAgo,
    comment,
    upvotes = 0,
    downvotes = 0,
    onUpvote,
    onDownvote,
    voteLoading = false,
    onReply,
    currentUserId,
    userId,
    onEdit,
    onDelete,
    onReport,
    isEditing = false,
    editContent = "",
    onEditContentChange,
    onEditSave,
    onEditCancel,
    isSubmitting = false,
}: CommentCardProps) {
    const isOwnComment = currentUserId && userId && currentUserId === userId;

    // Sanitize the comment content
    const sanitizedComment = DOMPurify.sanitize(comment, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
        ALLOWED_ATTR: ['href', 'target']
    });

    return (
        <div className="flex flex-col w-full py-4">
            <div className="flex items-center gap-3 mb-1">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={avatarSrc} alt={name} />
                    <AvatarFallback className="flex items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 size-8">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold text-gray-900 dark:text-gray-50 text-sm">{fullName}</span>
                </div>
                <span className="text-xs text-gray-400">{timeAgo}</span>
            </div>
            {isEditing ? (
                <div className="pl-11 mt-2">
                    <div className="bg-white dark:bg-gray-950 rounded-md border border-gray-200 dark:border-gray-800 flex flex-col gap-3 p-4 focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-transparent">
                        <Textarea
                            value={editContent}
                            onChange={onEditContentChange}
                            rows={2}
                            className="mb-0 border-none focus:ring-0 resize-none bg-transparent text-sm p-0 shadow-none"
                        />
                        <div className="flex items-center justify-end gap-2">
                            <Button
                                type="button"
                                className="text-xs font-normal"
                                variant="ghost"
                                onClick={onEditCancel}

                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                className="text-xs font-normal"
                                disabled={!editContent.trim() || isSubmitting}
                                onClick={onEditSave}
                            >
                                {isSubmitting ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div
                        className="pl-11 text-gray-800 dark:text-gray-200 text-sm mb-2"
                        dangerouslySetInnerHTML={{ __html: sanitizedComment }}
                    />
                    <div className="pl-11 flex items-center gap-4 text-gray-500 text-xs">
                        <button type="button" onClick={onUpvote} className="flex items-center gap-1 hover:text-orange-500 transition" disabled={voteLoading}>
                            {voteLoading ? <span className="animate-spin">⏳</span> : <ThumbsUpIcon size={16} weight="bold" />}
                            <span>{upvotes}</span>
                        </button>
                        <button type="button" onClick={onDownvote} className="flex items-center gap-1 hover:text-orange-500 transition" disabled={voteLoading}>
                            {voteLoading ? <span className="animate-spin">⏳</span> : <ThumbsDownIcon size={16} weight="bold" />}
                            <span>{downvotes}</span>
                        </button>
                        <button type="button" onClick={onReply} className="hover:text-orange-500 transition">Reply</button>
                        <div className="ml-auto">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button type="button" className="hover:text-gray-700 px-2 py-1 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        •••
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {isOwnComment ? (
                                        <>
                                            <DropdownMenuItem onClick={onEdit}>Edit</DropdownMenuItem>
                                            <DropdownMenuItem onClick={onDelete}>Delete</DropdownMenuItem>
                                        </>
                                    ) : (
                                        <DropdownMenuItem onClick={onReport}>Report</DropdownMenuItem>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}