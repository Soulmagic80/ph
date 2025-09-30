import * as PhosphorIcons from "@phosphor-icons/react";
import { ReactNode } from "react";

interface FeedbackDisplayChipProps {
    iconName: string;
    title: string;
    category: string;
    description: string;
    count: number;
}

function getPhosphorIcon(iconName: string): ReactNode {
    // Fallback auf TextAa, falls Icon nicht gefunden
    const IconComponent = (PhosphorIcons as any)[iconName] || PhosphorIcons.TextAa;
    return <IconComponent size={20} weight="regular" className="text-tremor-content" />;
}

export default function FeedbackDisplayChip({
    iconName,
    title,
    description,
    count,
}: FeedbackDisplayChipProps) {
    return (
        <div className="w-full flex flex-col gap-4 rounded-lg border transition-colors p-4 text-left bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <div className="flex justify-between items-start">
                <div className="flex-shrink-0">
                    {getPhosphorIcon(iconName)}
                </div>
                <div className="flex-shrink-0">
                    <span className="text-xs font-geist text-gray-500 dark:text-gray-400">{count} votes</span>
                </div>
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex flex-col gap-1">
                    <span className="font-medium text-sm text-tremor-title dark:text-tremor-title-dark">{title}</span>
                    <span className="text-xs text-gray-500 dark:text-gray-400 font-normal leading-snug">
                        {description}
                    </span>
                </div>
            </div>
        </div>
    );
} 