"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Plus, X } from "lucide-react";
import { KeyboardEvent, useState } from "react";

interface TagInputProps {
    tags: string[];
    onTagsChange: (tags: string[]) => void;
    placeholder?: string;
    maxTags?: number;
    className?: string;
    disabled?: boolean;
}

export default function TagInput({
    tags,
    onTagsChange,
    placeholder = "Type a tag and press Enter",
    maxTags = 10,
    className = "",
    disabled = false
}: TagInputProps) {
    const [inputValue, setInputValue] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    const addTag = (tagText: string) => {
        if (disabled) return;
        const trimmedTag = tagText.trim().toLowerCase();

        // Validation
        if (!trimmedTag) return;
        if (tags.includes(trimmedTag)) return; // No duplicates
        if (tags.length >= maxTags) return; // Max tags limit
        if (trimmedTag.length > 20) return; // Max tag length

        const newTags = [...tags, trimmedTag];
        onTagsChange(newTags);
        setInputValue("");
        setIsAdding(false); // Close input after adding
    };

    const removeTag = (indexToRemove: number) => {
        if (disabled) return;
        const newTags = tags.filter((_, index) => index !== indexToRemove);
        onTagsChange(newTags);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTag(inputValue);
        } else if (e.key === 'Escape') {
            setIsAdding(false);
            setInputValue("");
        } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
            // Remove last tag when backspace is pressed on empty input
            removeTag(tags.length - 1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        // Handle comma-separated input (for pasting)
        if (value.includes(',')) {
            const newTags = value.split(',').map(tag => tag.trim()).filter(Boolean);
            newTags.forEach(tag => addTag(tag));
            setInputValue("");
            return;
        }

        setInputValue(value);
    };

    const handleAddClick = () => {
        setIsAdding(true);
        // Focus will be handled by the input when it appears
    };

    const handleCancel = () => {
        setIsAdding(false);
        setInputValue("");
    };

    const canAddMore = tags.length < maxTags;

    return (
        <div className={`space-y-4 ${className}`}>
            {/* Tags Display */}
            {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                        <Badge
                            key={index}
                            variant="default"
                            className="flex items-center gap-1 px-2 py-1 text-sm"
                        >
                            <span>{tag}</span>
                            <button
                                type="button"
                                onClick={() => removeTag(index)}
                                className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                                aria-label={`Remove ${tag} tag`}
                                disabled={disabled}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            {/* Tag count indicator */}
            <div className="text-xs text-gray-500">
                {tags.length}/{maxTags} tags
                {!canAddMore && " (maximum reached)"}
            </div>

            {/* Add Tag Button or Input */}
            {!isAdding ? (
                <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddClick}
                    disabled={!canAddMore}
                    className="mt-2"
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tag
                </Button>
            ) : (
                <div className="space-y-2">
                    <Input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        placeholder={placeholder}
                        autoFocus
                        className="mt-2"
                        disabled={disabled}
                    />
                    <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                            Press Enter to add • Escape to cancel • Comma to separate multiple
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleCancel}
                                className="border-gray-300 dark:border-gray-700"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="button"
                                onClick={() => addTag(inputValue)}
                                disabled={!inputValue.trim()}
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}



