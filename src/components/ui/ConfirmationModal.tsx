"use client";

import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";
import { Button } from "./Button";

interface ConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'warning' | 'info';
    isLoading?: boolean;
}

export default function ConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = 'danger',
    isLoading = false
}: ConfirmationModalProps) {
    // Handle escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen && !isLoading) {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            // Prevent body scroll
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, isLoading, onClose]);

    if (!isOpen) return null;

    const getVariantStyles = () => {
        switch (variant) {
            case 'danger':
                return {
                    icon: 'text-red-500',
                    confirmButton: 'bg-red-600 hover:bg-red-700 text-white'
                };
            case 'warning':
                return {
                    icon: 'text-yellow-500',
                    confirmButton: 'bg-yellow-600 hover:bg-yellow-700 text-white'
                };
            case 'info':
                return {
                    icon: 'text-blue-500',
                    confirmButton: 'bg-blue-600 hover:bg-blue-700 text-white'
                };
            default:
                return {
                    icon: 'text-red-500',
                    confirmButton: 'bg-red-600 hover:bg-red-700 text-white'
                };
        }
    };

    const styles = getVariantStyles();

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
                onClick={!isLoading ? onClose : undefined}
            />

            {/* Modal */}
            <div className="flex min-h-full items-center justify-center p-4">
                <div className="relative bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-auto">
                    {/* Close button */}
                    {!isLoading && (
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}

                    {/* Content */}
                    <div className="p-6">
                        <div className="flex items-center mb-4">
                            <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${styles.icon}`}>
                                <AlertTriangle className="w-5 h-5" />
                            </div>
                            <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">
                                {title}
                            </h3>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-300 mb-6">
                            {message}
                        </p>

                        <div className="flex gap-3 justify-end">
                            <Button
                                variant="ghost"
                                onClick={onClose}
                                disabled={isLoading}
                            >
                                {cancelText}
                            </Button>
                            <Button
                                onClick={onConfirm}
                                disabled={isLoading}
                                className={`${styles.confirmButton} ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isLoading ? 'Processing...' : confirmText}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}




