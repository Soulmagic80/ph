"use client";

import ConfirmationModal from "@/components/ui/ConfirmationModal";

interface ConfirmationState {
    isOpen: boolean;
    portfolioId: string;
    portfolioTitle: string;
}

interface AdminPortfolioModalsProps {
    deleteConfirmation: ConfirmationState;
    restoreConfirmation: ConfirmationState;
    processingId: string | null;
    onDeleteConfirmationChange: (state: ConfirmationState) => void;
    onRestoreConfirmationChange: (state: ConfirmationState) => void;
    onConfirmDelete: () => void;
    onConfirmRestore: () => void;
}

export default function AdminPortfolioModals({
    deleteConfirmation,
    restoreConfirmation,
    processingId,
    onDeleteConfirmationChange,
    onRestoreConfirmationChange,
    onConfirmDelete,
    onConfirmRestore
}: AdminPortfolioModalsProps) {
    return (
        <>
            {/* Delete Confirmation Modal */}
            <ConfirmationModal
                isOpen={deleteConfirmation.isOpen}
                onClose={() => onDeleteConfirmationChange({ isOpen: false, portfolioId: '', portfolioTitle: '' })}
                onConfirm={onConfirmDelete}
                title="Delete Portfolio"
                message={`Are you sure you want to delete "${deleteConfirmation.portfolioTitle}"? This action can be undone by restoring the portfolio.`}
                confirmText="Delete"
                cancelText="Cancel"
                variant="danger"
                isLoading={processingId === deleteConfirmation.portfolioId}
            />

            {/* Restore Confirmation Modal */}
            <ConfirmationModal
                isOpen={restoreConfirmation.isOpen}
                onClose={() => onRestoreConfirmationChange({ isOpen: false, portfolioId: '', portfolioTitle: '' })}
                onConfirm={onConfirmRestore}
                title="Restore Portfolio"
                message={`Are you sure you want to restore "${restoreConfirmation.portfolioTitle}"? This will make it visible to users again.`}
                confirmText="Restore"
                cancelText="Cancel"
                variant="info"
                isLoading={processingId === restoreConfirmation.portfolioId}
            />
        </>
    );
}
