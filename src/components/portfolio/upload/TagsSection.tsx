"use client";

import TagInput from "@/components/ui/TagInput";
import { StatusBadge } from "./StatusBadge";

interface TagsSectionProps {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    isReadOnly?: boolean;
    status?: 'draft' | 'pending' | 'approved' | 'published' | 'declined';
    published?: boolean;
    isVisible?: boolean;
}

export default function TagsSection({ 
    tags, 
    onTagsChange, 
    isReadOnly = false,
    status = 'draft',
    published = false,
    isVisible = true
}: TagsSectionProps) {

    return (
        <section aria-labelledby="tags-heading">
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                <div>
                    <h2
                        id="tags-heading"
                        className="heading-section"
                    >
                        Tags
                    </h2>
                    <p className="text-small mt-2">
                        Add relevant tags to help others discover your portfolio. Use keywords that describe your project, industry, or skills.
                    </p>
                    {status !== 'draft' && (
                        <StatusBadge status={status} published={published} isVisible={isVisible} />
                    )}
                </div>
                <div className={`md:col-span-2 md:pl-16 relative ${isReadOnly ? 'opacity-50 pointer-events-none' : ''}`}>
                    <TagInput
                        tags={tags}
                        onTagsChange={onTagsChange}
                        placeholder="Add tags (e.g., React, Design, E-commerce)"
                        maxTags={5}
                        disabled={isReadOnly}
                    />
                </div>
            </div>
        </section>
    );
}
