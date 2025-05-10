import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface CommentCardProps {
    avatarSrc: string;
    avatarFallback: string;
    name: string;
    timeAgo: string;
    comment: string;
    role?: string;
}

export default function CommentCard({ avatarSrc, avatarFallback, name, timeAgo, comment, role = "User" }: CommentCardProps) {
    return (
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg p-3">
            <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700">
                        <AvatarImage src={avatarSrc} alt={name} />
                        <AvatarFallback className="text-xs">{avatarFallback}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                        <span className="font-medium text-xs text-gray-900 dark:text-gray-50">{name}</span>
                        <Badge variant="default">{role}</Badge>
                        <span className="text-xs text-gray-500">{timeAgo}</span>
                    </div>
                </div>
                <p className="text-sm text-gray-900 dark:text-white pl-11">
                    {comment}
                </p>
            </div>
        </div>
    );
} 