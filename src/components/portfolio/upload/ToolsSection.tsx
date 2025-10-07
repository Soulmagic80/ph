"use client";

import { StatusBadge } from "./StatusBadge";
import ToolsSelector from "./ToolsSelector";

interface Tool {
    id: string;
    name: string;
    category: string;
}

interface ToolsSectionProps {
    selectedTools: Tool[];
    availableTools: Tool[];
    onToolsChange: (tools: Tool[]) => void;
    isLoading: boolean;
    isReadOnly?: boolean;
    status?: 'draft' | 'pending' | 'approved' | 'published' | 'declined';
    published?: boolean;
    isVisible?: boolean;
}

export default function ToolsSection({
    selectedTools,
    availableTools,
    onToolsChange,
    isLoading,
    isReadOnly = false,
    status = 'draft',
    published = false,
    isVisible = true
}: ToolsSectionProps) {

    return (
        <section aria-labelledby="tools-heading">
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                <div>
                    <h2
                        id="tools-heading"
                        className="heading-section"
                    >
                        Tools & Technologies
                    </h2>
                    <p className="text-small mt-2">
                        Select the tools and technologies you used to create this portfolio project.
                    </p>
                    {isReadOnly && (
                        <StatusBadge status={status} published={published} isVisible={isVisible} />
                    )}
                </div>
                <div className={`md:col-span-2 md:pl-16 relative ${isReadOnly ? 'opacity-50 pointer-events-none' : ''}`}>
                    <ToolsSelector
                        selectedTools={selectedTools}
                        availableTools={availableTools}
                        onToolsChange={onToolsChange}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </section>
    );
}
