"use client";

import AdminPortfolioModals from "@/components/admin/AdminPortfolioModals";
import { createPortfolioColumns, PortfolioColumnsProps } from "@/components/ui/data-table/PortfolioColumns";
import { PortfolioDataTable } from "@/components/ui/data-table/PortfolioDataTable";
import { useAdminPortfolioActions } from "@/hooks/admin/useAdminPortfolioActions";
import { useAuth } from "@/hooks/shared/useAuth";
import { createClient } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface AdminPortfolio {
    id: string;
    title: string;
    description: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    deleted_by: string | null;
    published: boolean;
    approved: boolean;
    is_visible: boolean;
    images: string[];
    user: {
        id: string;
        username: string | null;
        full_name: string | null;
    };
    feedback_count?: number;
}

export default function AdminPortfoliosPage() {
    const { user, profile } = useAuth();
    const [portfolios, setPortfolios] = useState<AdminPortfolio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [deleteConfirmation, setDeleteConfirmation] = useState<{
        isOpen: boolean;
        portfolioId: string;
        portfolioTitle: string;
    }>({ isOpen: false, portfolioId: '', portfolioTitle: '' });
    const [restoreConfirmation, setRestoreConfirmation] = useState<{
        isOpen: boolean;
        portfolioId: string;
        portfolioTitle: string;
    }>({ isOpen: false, portfolioId: '', portfolioTitle: '' });

    // Redirect if not admin
    useEffect(() => {
        if (user && profile && !profile.is_admin) {
            window.location.href = '/user/profile';
        }
    }, [user, profile]);

    // Fetch portfolios
    useEffect(() => {
        async function fetchPortfolios() {
            if (!user || !profile?.is_admin) return;

            try {
                const supabase = createClient();

                const { data, error } = await supabase
                    .from('portfolios')
                    .select(`
                        id,
                        title,
                        description,
                        status,
                        created_at,
                        updated_at,
                        deleted_at,
                        deleted_by,
                        published,
                        approved,
                        is_visible,
                        images,
                        user:profiles!portfolios_user_id_fkey (
                            id,
                            username,
                            full_name
                        )
                    `)
                    .order('created_at', { ascending: false });

                if (error) {
                    console.error('Error fetching portfolios:', error);
                    toast.error('Failed to fetch portfolios');
                    return;
                }

                // Get feedback counts for users
                const userIds = data?.map(p => {
                    const user = Array.isArray((p as any).user) ? (p as any).user[0] : (p as any).user;
                    return user?.id;
                }).filter(Boolean) || [];
                let feedbackCountMap: Record<string, number> = {};

                if (userIds.length > 0) {
                    try {
                        // Call backend API to get feedback counts with proper service role access
                        const response = await fetch('/api/admin/feedback-counts', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ userIds })
                        });

                        if (!response.ok) {
                            throw new Error(`API error: ${response.status}`);
                        }

                        const result = await response.json();

                        if (result.success) {
                            feedbackCountMap = result.feedbackCounts;
                        }
                    } catch (error) {
                        console.warn('Failed to fetch user feedback counts:', error);
                    }
                }

                const portfoliosWithFeedback = data?.map(portfolio => {
                    const user = Array.isArray((portfolio as any).user) ? (portfolio as any).user[0] : (portfolio as any).user;
                    const userId = user?.id;
                    return {
                        ...(portfolio as any),
                        user: user,
                        feedback_count: feedbackCountMap[userId || ''] || 0
                    };
                }) || [];

                setPortfolios(portfoliosWithFeedback);
            } catch (error) {
                console.error('Error:', error);
                toast.error('Failed to fetch portfolios');
            } finally {
                setIsLoading(false);
            }
        }

        fetchPortfolios();

        // Set up polling for live updates (every 5 seconds)
        const interval = setInterval(() => {
            fetchPortfolios();
        }, 5000);

        return () => {
            clearInterval(interval);
        };
    }, [user, profile]);

    // Use the custom hook for all portfolio actions
    const {
        handleApprove,
        handleDecline,
        handleSoftDelete: handleSoftDeleteAction,
        handleRestore: handleRestoreAction,
        handleUnpublish,
        handleBulkAction: handleBulkActionHook
    } = useAdminPortfolioActions({
        user,
        portfolios,
        setPortfolios,
        setProcessingId
    });

    // Wrapper functions for modal confirmations
    const handleSoftDelete = () => {
        const { portfolioId } = deleteConfirmation;
        handleSoftDeleteAction(portfolioId);
        setDeleteConfirmation({ isOpen: false, portfolioId: '', portfolioTitle: '' });
    };

    const handleRestore = () => {
        const { portfolioId } = restoreConfirmation;
        handleRestoreAction(portfolioId);
        setRestoreConfirmation({ isOpen: false, portfolioId: '', portfolioTitle: '' });
    };

    // Use the bulk action from the hook (parameter order matches PortfolioDataTable)
    const handleBulkAction = (action: string, selectedIds: string[]) => {
        handleBulkActionHook(selectedIds, action as 'approve' | 'decline' | 'delete' | 'restore' | 'unpublish');
    };

    // Create columns with action handlers
    const columnProps: PortfolioColumnsProps = {
        onApprove: handleApprove,
        onDecline: handleDecline,
        onDelete: (id) => setDeleteConfirmation({
            isOpen: true,
            portfolioId: id,
            portfolioTitle: portfolios.find(p => p.id === id)?.title || 'Unknown'
        }),
        onRestore: (id) => setRestoreConfirmation({
            isOpen: true,
            portfolioId: id,
            portfolioTitle: portfolios.find(p => p.id === id)?.title || 'Unknown'
        }),
        onUnpublish: handleUnpublish,
        processingId
    };

    const columns = createPortfolioColumns(columnProps);

    if (!user || !profile?.is_admin) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                    Access Denied
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    You need admin privileges to access this page.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">

            {isLoading ? (
                <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                    <div className="animate-pulse">
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded"></div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <PortfolioDataTable
                    columns={columns}
                    data={portfolios}
                    onBulkAction={handleBulkAction}
                />
            )}

            {/* Confirmation Modals */}
            <AdminPortfolioModals
                deleteConfirmation={deleteConfirmation}
                restoreConfirmation={restoreConfirmation}
                processingId={processingId}
                onDeleteConfirmationChange={setDeleteConfirmation}
                onRestoreConfirmationChange={setRestoreConfirmation}
                onConfirmDelete={handleSoftDelete}
                onConfirmRestore={handleRestore}
            />
        </div>
    );
}
