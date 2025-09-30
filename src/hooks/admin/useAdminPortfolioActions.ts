"use client";

import { createClient } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
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
    images: string[];
    user: {
        id: string;
        username: string | null;
        full_name: string | null;
    };
    feedback_count?: number;
}

interface UseAdminPortfolioActionsProps {
    user: User | null;
    portfolios: AdminPortfolio[];
    setPortfolios: React.Dispatch<React.SetStateAction<AdminPortfolio[]>>;
    setProcessingId: React.Dispatch<React.SetStateAction<string | null>>;
}

export function useAdminPortfolioActions({
    user,
    portfolios: _portfolios,
    setPortfolios,
    setProcessingId
}: UseAdminPortfolioActionsProps) {

    const handleApprove = async (portfolioId: string) => {
        setProcessingId(portfolioId);
        try {
            const response = await fetch(`/api/admin/portfolios/${portfolioId}/approve`, {
                method: 'POST',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to approve portfolio');
            }

            toast.success('Portfolio approved successfully');

            // Update local state
            setPortfolios(prev => prev.map(p =>
                p.id === portfolioId
                    ? { ...p, status: 'approved', approved: true, published: false }
                    : p
            ));
        } catch (error) {
            console.error('Error approving portfolio:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to approve portfolio');
        } finally {
            setProcessingId(null);
        }
    };

    const handleDecline = async (portfolioId: string) => {
        setProcessingId(portfolioId);
        try {
            const response = await fetch(`/api/admin/portfolios/${portfolioId}/decline`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reason: 'Admin declined' }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to decline portfolio');
            }

            toast.success('Portfolio declined successfully');

            // Update local state
            setPortfolios(prev => prev.map(p =>
                p.id === portfolioId
                    ? { ...p, status: 'declined', approved: false }
                    : p
            ));
        } catch (error) {
            console.error('Error declining portfolio:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to decline portfolio');
        } finally {
            setProcessingId(null);
        }
    };

    const handleSoftDelete = async (portfolioId: string) => {
        setProcessingId(portfolioId);
        try {
            const response = await fetch(`/api/admin/portfolios/${portfolioId}/delete`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete portfolio');
            }

            toast.success('Portfolio deleted successfully');

            setPortfolios(prev => prev.map(p =>
                p.id === portfolioId
                    ? { ...p, deleted_at: new Date().toISOString(), deleted_by: user?.id || null }
                    : p
            ));
        } catch (error) {
            console.error('Error deleting portfolio:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to delete portfolio');
        } finally {
            setProcessingId(null);
        }
    };

    const handleRestore = async (portfolioId: string, showToast = true) => {
        setProcessingId(portfolioId);

        try {
            const supabase = createClient();

            const { error } = await (supabase as any)
                .from('portfolios')
                .update({
                    deleted_at: null,
                    deleted_by: null
                })
                .eq('id', portfolioId);

            if (error) {
                throw new Error('Failed to restore portfolio');
            }

            if (showToast) {
                toast.success('Portfolio restored successfully');
            }

            // Update local state
            setPortfolios(prev => prev.map(p =>
                p.id === portfolioId
                    ? { ...p, deleted_at: null, deleted_by: null }
                    : p
            ));
        } catch (error) {
            console.error('Error restoring portfolio:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to restore portfolio');
        } finally {
            setProcessingId(null);
        }
    };

    const handleUnpublish = async (portfolioId: string) => {
        setProcessingId(portfolioId);
        try {
            const response = await fetch(`/api/admin/portfolios/${portfolioId}/unpublish`, {
                method: 'POST',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to unpublish portfolio');
            }

            const result = await response.json();
            toast.success(result.message || 'Portfolio unpublished successfully');

            // Update local state
            setPortfolios(prev => prev.map(p =>
                p.id === portfolioId
                    ? { ...p, status: 'pending', approved: false, published: false }
                    : p
            ));
        } catch (error) {
            console.error('Error unpublishing portfolio:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to unpublish portfolio');
        } finally {
            setProcessingId(null);
        }
    };

    const handleBulkAction = async (selectedIds: string[], action: 'approve' | 'decline' | 'delete' | 'restore' | 'unpublish') => {
        try {
            const supabase = createClient();

            // For approve action, validate that no drafts are selected
            if (action === 'approve') {
                const { data: selectedPortfolios, error: fetchError } = await supabase
                    .from('portfolios')
                    .select('id, status')
                    .in('id', selectedIds);

                if (fetchError) {
                    throw new Error('Failed to validate selected portfolios');
                }

                const draftPortfolios = selectedPortfolios?.filter(p => p.status === 'draft') || [];
                if (draftPortfolios.length > 0) {
                    toast.error(`Cannot approve ${draftPortfolios.length} draft portfolio(s). Only pending portfolios can be approved.`);
                    return;
                }
            }

            let updateData: any = {};
            switch (action) {
                case 'approve':
                    updateData = { status: 'approved', approved: true };
                    break;
                case 'decline':
                    updateData = { status: 'declined', approved: false, published: false };
                    break;
                case 'delete':
                    updateData = { deleted_at: new Date().toISOString(), deleted_by: user?.id };
                    break;
                case 'restore':
                    updateData = { deleted_at: null, deleted_by: null };
                    break;
                case 'unpublish':
                    updateData = { status: 'pending', approved: false, published: false };
                    break;
            }

            const { error } = await supabase
                .from('portfolios')
                .update(updateData)
                .in('id', selectedIds);

            if (error) {
                throw new Error(`Failed to ${action} portfolios`);
            }

            // Refresh data
            const { data } = await supabase
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
                    images,
                    user:profiles!portfolios_user_id_fkey (
                        id,
                        username,
                        full_name
                    )
                `)
                .order('created_at', { ascending: false });

            if (data) {
                setPortfolios(data.map(portfolio => ({
                    ...(portfolio as any),
                    user: Array.isArray((portfolio as any).user) ? (portfolio as any).user[0] : (portfolio as any).user,
                    feedback_count: 0 // Will be updated in next fetch
                })));
            }

            toast.success(`${selectedIds.length} portfolio(s) ${action}d successfully`);
        } catch (error) {
            console.error(`Error performing bulk ${action}:`, error);
            toast.error(`Failed to ${action} selected portfolios`);
        }
    };

    return {
        handleApprove,
        handleDecline,
        handleSoftDelete,
        handleRestore,
        handleUnpublish,
        handleBulkAction
    };
}
