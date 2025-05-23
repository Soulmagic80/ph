import { Badge } from "@/components/ui/Badge";
import { toolIcons, type ToolName } from "@/lib/toolIcons";

interface ToolBadgeProps {
    tool: ToolName;
}

export function ToolBadge({ tool }: ToolBadgeProps) {
    const Icon = toolIcons[tool];
    return (
        <Badge variant="neutral" className="flex items-center gap-1.5">
            <Icon className="w-3.5 h-3.5" />
            <span className="text-xs font-medium capitalize">{tool}</span>
        </Badge>
    );
} 