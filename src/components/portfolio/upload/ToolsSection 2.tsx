"use client";

import { Clock } from "lucide-react";
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
}

export default function ToolsSection({
    selectedTools,
    availableTools,
    onToolsChange,
    isLoading,
    isReadOnly = false
}: ToolsSectionProps) {

    return (
        <section aria-labelledby="tools-heading">
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                <div>
                    <h2
                        id="tools-heading"
                        className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
                    >
                        Tools & Technologies
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Select the tools and technologies you used to create this portfolio project.
                    </p>
                    {isReadOnly && (
                        <div className="inline-flex items-center px-2 py-1 mt-3 rounded text-xs font-medium bg-orange-50 text-orange-900 ring-1 ring-orange-500/30 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/30">
                            <Clock className="w-3 h-3 mr-1.5" />
                            PENDING APPROVAL
                        </div>
                    )}
                </div>
                <div className="md:col-span-2 md:pl-16 relative">
                    {isReadOnly && (
                        <div className="absolute inset-0 bg-white/90 dark:bg-gray-950/70 z-10 rounded-lg"></div>
                    )}
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
