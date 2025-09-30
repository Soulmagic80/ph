"use client";

import { Clock } from "lucide-react";
import StyleSelector from "./StyleSelector";

interface Style {
    id: string;
    name: string;
    display_name: string;
    category: string | null;
}

interface StyleSectionProps {
    selectedStyles: Style[];
    availableStyles: Style[];
    onStylesChange: (styles: Style[]) => void;
    isLoading: boolean;
    isReadOnly?: boolean;
}

export default function StyleSection({
    selectedStyles,
    availableStyles,
    onStylesChange,
    isLoading,
    isReadOnly = false
}: StyleSectionProps) {

    return (
        <section aria-labelledby="styles-heading">
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                <div>
                    <h2
                        id="styles-heading"
                        className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
                    >
                        Portfolio Style
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Choose styles that best describe the visual and functional characteristics of your portfolio.
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
                    <StyleSelector
                        selectedStyles={selectedStyles}
                        availableStyles={availableStyles}
                        onStylesChange={onStylesChange}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </section>
    );
}
