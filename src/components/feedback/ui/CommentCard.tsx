import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/Avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { ThumbsDownIcon, ThumbsUpIcon } from "@phosphor-icons/react";
import React from "react";

interface CommentCardProps {
    avatarSrc: string;
    avatarFallback: string;
    name: string;
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
}

export default function CommentCard({
    avatarSrc,
    avatarFallback,
    name,
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
}: CommentCardProps) {
    const isOwnComment = currentUserId && userId && currentUserId === userId;
    return (
        <div className="flex flex-col w-full py-4">
            <div className="flex items-center gap-3 mb-1">
                <Avatar className="w-8 h-8">
                    <AvatarImage src={avatarSrc} alt={name} />
                    <AvatarFallback className="flex items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300 size-8">
                        {avatarFallback}
                    </AvatarFallback>
                </Avatar>
                <span className="font-semibold text-gray-900 dark:text-gray-50 text-sm">{name}</span>
                <span className="text-xs text-gray-400">{timeAgo}</span>
            </div>
            <div className="pl-11 text-gray-800 dark:text-gray-200 text-sm mb-2">
                {comment}
            </div>
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
        </div>
    );
} 