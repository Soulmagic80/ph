"use client";

import { Button } from "@/components/ui/Button";
import ConfirmationModal from "@/components/ui/ConfirmationModal";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface DeletePortfolioButtonProps {
    portfolioId: string;
    portfolioTitle: string;
    onDeleted?: () => void;
    variant?: 'button' | 'icon';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}

export default function DeletePortfolioButton({
    portfolioId,
    portfolioTitle,
    onDeleted,
    variant = 'button',
    size = 'md',
    className = ''
}: DeletePortfolioButtonProps) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);

        try {
            const response = await fetch(`/api/portfolios/${portfolioId}/delete`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete portfolio');
            }

            toast.success('Portfolio deleted successfully');
            setShowConfirmation(false);

            if (onDeleted) {
                onDeleted();
            }
        } catch (error) {
            console.error('Error deleting portfolio:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to delete portfolio');
        } finally {
            setIsDeleting(false);
        }
    };

    if (variant === 'icon') {
        return (
            <>
                <button
                    onClick={() => setShowConfirmation(true)}
                    className={`p-2 text-gray-400 hover:text-red-500 transition-colors ${className}`}
                    title="Delete portfolio"
                >
                    <Trash2 className={`${size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-6 h-6' : 'w-5 h-5'}`} />
                </button>

                <ConfirmationModal
                    isOpen={showConfirmation}
                    onClose={() => setShowConfirmation(false)}
                    onConfirm={handleDelete}
                    title="Delete Portfolio"
                    message={`Are you sure you want to delete "${portfolioTitle}"? This action can be undone by contacting support.`}
                    confirmText="Delete"
                    cancelText="Cancel"
                    variant="danger"
                    isLoading={isDeleting}
                />
            </>
        );
    }

    return (
        <>
            <Button
                variant="ghost"
                onClick={() => setShowConfirmation(true)}
                className={`text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 ${className}`}
            >
                <Trash2 className={`${size === 'sm' ? 'w-4 h-4' : 'w-5 h-5'} mr-2`} />
                Delete
            </Button>

            <ConfirmationModal
                isOpen={showConfirmation}
                onClose={() => setShowConfirmation(false)}
                onConfirm={handleDelete}
                title="Delete Portfolio"
                message={`Are you sure you want to delete "${portfolioTitle}"? This action can be undone by contacting support.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                isLoading={isDeleting}
            />
        </>
    );
}




