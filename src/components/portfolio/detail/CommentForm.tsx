"use client";

import { Button } from "@/components/ui/Button";
import { Textarea } from "@/components/ui/Textarea";
import { User } from "@supabase/supabase-js";
import React from "react";

interface CommentFormProps {
    user: User | null;
    value: string;
    onChange: (value: string) => void;
    onSubmit: (e: React.MouseEvent) => void;
    isSubmitting: boolean;
    placeholder?: string;
    submitText?: string;
    showIcon?: boolean;
}

export default function CommentForm({
    user,
    value,
    onChange,
    onSubmit,
    isSubmitting,
    placeholder = "Write a comment...",
    submitText = "Submit"
}: CommentFormProps) {
    if (!user) {
        return null; // Don't show anything if user is not logged in
    }

    return (
        <div className="mb-8 space-y-3">
            <Textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={4}
                className="w-full border-gray-300 dark:border-gray-800 bg-transparent focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 resize-none"
                disabled={isSubmitting}
            />
            <div className="flex items-center justify-end gap-2">
                <Button
                    type="button"
                    variant="ghost"
                    className="text-sm"
                    onClick={() => onChange("")}
                    disabled={isSubmitting}
                >
                    Cancel
                </Button>
                <Button
                    type="button"
                    variant="primary"
                    className="text-sm"
                    disabled={!value.trim() || isSubmitting}
                    onClick={onSubmit}
                >
                    {isSubmitting ? "Posting..." : submitText}
                </Button>
            </div>
        </div>
    );
}
