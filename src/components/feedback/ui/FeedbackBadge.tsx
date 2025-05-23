import React from "react";

interface FeedbackBadgeProps {
    icon?: React.ReactNode;
    text: string;
}

export default function FeedbackBadge({ icon, text }: FeedbackBadgeProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-lg bg-beige-300 flex items-center justify-center">
                {/* Dummy Icon: Replace with real icon later */}
                {icon || (
                    <svg width="20" height="20" fill="none" stroke="#232B38" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M8 12h8M12 8v8" />
                    </svg>
                )}
            </div>
            <span className="font-courier-prime text-[14px] text-supergrey-100">{text}</span>
        </div>
    );
} 