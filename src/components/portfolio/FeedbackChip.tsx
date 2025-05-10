import { ReactNode } from "react";

interface FeedbackChipProps {
    icon: ReactNode;
    text: string;
    count: number;
}

export function FeedbackChip({ icon, text, count }: FeedbackChipProps) {
    return (
        <div className="flex items-center gap-2 pl-2 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg">
            <div className="p-1.5 rounded-md bg-gray-50 dark:bg-gray-800/50">
                {icon}
            </div>
            <div className="flex flex-col">
                <span className="text-sm font-geist font-normal text-gray-900 dark:text-white">{text}</span>
                <span className="text-xs font-geist text-gray-500 dark:text-gray-400">{count} votes</span>
            </div>
        </div>
    );
} 