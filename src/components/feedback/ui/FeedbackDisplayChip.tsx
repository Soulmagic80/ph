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
    category,
    description,
    count,
}: FeedbackDisplayChipProps) {
    return (
        <div className="w-full flex items-center gap-4 rounded-lg border transition-colors px-5 py-4 text-left bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800">
            <div className="flex-shrink-0 flex items-center justify-center">
                {getPhosphorIcon(iconName)}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium text-sm text-tremor-title dark:text-tremor-title-dark">{title}</span>
                    <span className="inline-flex items-center rounded-md bg-white dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-geist font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10">
                        {category}
                    </span>
                </div>
                <div className="text-xs text-tremor-content dark:text-tremor-content-dark font-normal leading-snug">
                    {description}
                </div>
            </div>
            <div className="flex-shrink-0 ml-4">
                <span className="text-xs font-geist text-gray-500 dark:text-gray-400">{count} votes</span>
            </div>
        </div>
    );
} 