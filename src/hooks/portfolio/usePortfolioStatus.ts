import { useCallback, useEffect, useState } from "react";

// Types for the portfolio status response
export interface PortfolioStatusData {
    id: string;
    title: string;
    website_url: string;
    description: string;
    images: string[];
    tags: string[];
    style: string[];
    tools: Array<{
        id: string;
        name: string;
        category: string;
    }>;
    created_at: string;
    updated_at: string;
    published_at: string | null;
    declined_reason: string | null;
}

export interface PortfolioStatusResponse {
    success: boolean;
    portfolio: PortfolioStatusData | null;
    status: 'draft' | 'pending' | 'approved' | 'declined';
    approved: boolean;
    published: boolean;
    is_visible: boolean;
    feedback_count: number;
    canEdit: boolean;
    canSubmit: boolean;
    canPreview: boolean;
    canClearAll: boolean;
    showEditButton: boolean;
    showWithdrawButton: boolean;
    statusBadge: string;
    statusMessage: string;
    statusType: 'info' | 'warning' | 'success' | 'error';
}

export interface UsePortfolioStatusReturn {
    // Data
    portfolio: PortfolioStatusData | null;
    status: PortfolioStatusResponse['status'];
    isLoading: boolean;
    error: string | null;
    
    // Status info
    approved: boolean;
    published: boolean;
    is_visible: boolean;
    feedbackCount: number;
    
    // UI Capabilities
    canEdit: boolean;
    canSubmit: boolean;
    canPreview: boolean;
    canClearAll: boolean;
    showEditButton: boolean;
    showWithdrawButton: boolean;
    statusMessage: string;
    statusType: 'info' | 'warning' | 'success' | 'error';
    
    // Actions
    refetch: () => Promise<void>;
    withdrawPortfolio: () => Promise<{ success: boolean; error?: string }>;
    resubmitPortfolio: () => Promise<{ success: boolean; error?: string }>;
}

/**
 * Custom hook for managing portfolio status and capabilities
 * 
 * This hook provides:
 * - Current portfolio data and status
 * - UI capability flags (what buttons to show/enable)
 * - Status management actions (withdraw, resubmit)
 * - Real-time updates and error handling
 */
export function usePortfolioStatus(): UsePortfolioStatusReturn {
    const [data, setData] = useState<PortfolioStatusResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // const [supabase] = useState(() => createClient()); // Unused - removed Realtime subscription

    // Fetch portfolio status from API
    const fetchStatus = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch('/api/portfolios/status', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                if (response.status === 401) {
                    throw new Error('Authentication required');
                }
                throw new Error(`Failed to fetch portfolio status: ${response.status}`);
            }

            const result: PortfolioStatusResponse = await response.json();
            
            if (!result.success) {
                throw new Error('Failed to fetch portfolio status');
            }

            setData(result);
        } catch (err) {
            console.error('Error fetching portfolio status:', err);
            setError(err instanceof Error ? err.message : 'Unknown error occurred');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial fetch
    useEffect(() => {
        fetchStatus();
    }, [fetchStatus]);

    // Withdraw portfolio from pending back to draft
    const withdrawPortfolio = useCallback(async () => {
        try {
            const response = await fetch('/api/portfolios/status', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'withdraw' }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                return {
                    success: false,
                    error: result.error || 'Failed to withdraw portfolio'
                };
            }

            // Refresh status after successful withdrawal
            await fetchStatus();

            return { success: true };
        } catch (err) {
            console.error('Error withdrawing portfolio:', err);
            return {
                success: false,
                error: err instanceof Error ? err.message : 'Unknown error occurred'
            };
        }
    }, [fetchStatus]);

    // Resubmit declined portfolio
    const resubmitPortfolio = useCallback(async () => {
        try {
            const response = await fetch('/api/portfolios/status', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action: 'resubmit' }),
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                return {
                    success: false,
                    error: result.error || 'Failed to resubmit portfolio'
                };
            }

            // Refresh status after successful resubmission
            await fetchStatus();

            return { success: true };
        } catch (err) {
            console.error('Error resubmitting portfolio:', err);
            return {
                success: false,
                error: err instanceof Error ? err.message : 'Unknown error occurred'
            };
        }
    }, [fetchStatus]);

    // Real-time updates disabled to avoid WebSocket CSP issues
    // Portfolio status updates will be handled by manual refetch after actions

    // Return hook interface
    return {
        // Data
        portfolio: data?.portfolio || null,
        status: data?.status || 'draft',
        isLoading,
        error,
        
        // Status info
        approved: data?.approved || false,
        published: data?.published || false,
        is_visible: data?.is_visible !== false, // Default to true
        feedbackCount: data?.feedback_count || 0,
        
        // UI Capabilities
        // When no data (loading or no portfolio), use draft defaults
        canEdit: data?.canEdit !== undefined ? data.canEdit : true,
        canSubmit: data?.canSubmit !== undefined ? data.canSubmit : true,
        canPreview: data?.canPreview !== undefined ? data.canPreview : true,
        canClearAll: data?.canClearAll !== undefined ? data.canClearAll : true,
        showEditButton: data?.showEditButton || false,
        showWithdrawButton: data?.showWithdrawButton || false,
        statusMessage: data?.statusMessage || 'Ready to create your portfolio',
        statusType: data?.statusType || 'info',
        
        // Actions
        refetch: fetchStatus,
        withdrawPortfolio,
        resubmitPortfolio,
    };
}
