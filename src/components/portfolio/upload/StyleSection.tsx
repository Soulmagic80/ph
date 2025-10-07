"use client";

import { StatusBadge } from "./StatusBadge";
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
    status?: 'draft' | 'pending' | 'approved' | 'published' | 'declined';
    published?: boolean;
    isVisible?: boolean;
}

export default function StyleSection({
    selectedStyles,
    availableStyles,
    onStylesChange,
    isLoading,
    isReadOnly = false,
    status = 'draft',
    published = false,
    isVisible = true
}: StyleSectionProps) {

    return (
        <section aria-labelledby="styles-heading">
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                <div>
                    <h2
                        id="styles-heading"
                        className="heading-section"
                    >
                        Portfolio Style
                    </h2>
                    <p className="text-small mt-2">
                        Choose styles that best describe the visual and functional characteristics of your portfolio.
                    </p>
                    {isReadOnly && (
                        <StatusBadge status={status} published={published} isVisible={isVisible} />
                    )}
                </div>
                <div className={`md:col-span-2 md:pl-16 relative ${isReadOnly ? 'opacity-50 pointer-events-none' : ''}`}>
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
