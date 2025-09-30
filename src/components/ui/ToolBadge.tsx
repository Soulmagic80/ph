import { toolIcons, type ToolName } from "@/lib/toolIcons";

interface ToolBadgeProps {
    tool: ToolName;
}

export function ToolBadge({ tool }: ToolBadgeProps) {
    const Icon = toolIcons[tool];


    // Fallback if icon is not found
    if (!Icon) {
        return (
            <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium bg-green-50 text-green-900 ring-1 ring-inset ring-green-600/30 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/20 rounded-md">
                {tool}
            </span>
        );
    }

    return (
        <span className="inline-flex items-center gap-1.5 px-2 py-1 text-xs font-medium bg-green-50 text-green-900 ring-1 ring-inset ring-green-600/30 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/20 rounded-md">
            <Icon className="w-3.5 h-3.5" />
            {tool}
        </span>
    );
}