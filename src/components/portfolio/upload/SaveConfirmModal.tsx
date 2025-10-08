'use client'

import { Button } from '@/components/ui/Button'
import { AlertCircle } from 'lucide-react'
import { useEffect } from 'react'
import { createPortal } from 'react-dom'

interface SaveConfirmModalProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    isLoading?: boolean
}

export function SaveConfirmModal({ isOpen, onClose, onConfirm, isLoading = false }: SaveConfirmModalProps) {
    // Close on ESC key
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && !isLoading) {
                onClose()
            }
        }
        
        if (isOpen) {
            document.addEventListener('keydown', handleEsc)
            document.body.style.overflow = 'hidden'
        }
        
        return () => {
            document.removeEventListener('keydown', handleEsc)
            document.body.style.overflow = 'unset'
        }
    }, [isOpen, isLoading, onClose])

    if (!isOpen) return null

    const modalContent = (
        <div className="fixed inset-0 flex items-center justify-center p-4" style={{ zIndex: 9999 }}>
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={!isLoading ? onClose : undefined}
            />
            
            {/* Modal */}
            <div className="relative bg-white dark:bg-gray-850 rounded-lg shadow-xl max-w-md w-full p-6 border border-gray-200 dark:border-gray-700">
                {/* Icon */}
                <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full bg-blue-100 dark:bg-blue-900/20">
                    <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>

                {/* Title */}
                <h3 className="text-lg font-semibold text-center text-gray-900 dark:text-gray-50 mb-2">
                    Publish Changes?
                </h3>

                {/* Message */}
                <p className="text-sm text-center text-gray-600 dark:text-gray-400 mb-6">
                    Your portfolio will go live instantly with your latest changes. No approval needed.
                </p>

                {/* Actions */}
                <div className="flex gap-3">
                    <Button
                        onClick={onClose}
                        disabled={isLoading}
                        variant="secondary"
                        className="flex-1"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={onConfirm}
                        disabled={isLoading}
                        variant="primary"
                        className="flex-1"
                    >
                        {isLoading ? 'Publishing...' : 'Publish'}
                    </Button>
                </div>
            </div>
        </div>
    )

    // Render modal in a portal at document.body level
    return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null
}

