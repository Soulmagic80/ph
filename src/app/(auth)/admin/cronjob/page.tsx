"use client";

import { PublishSettings } from "@/components/admin/PublishSettings";
import { createCronJobColumns } from "@/components/ui/data-table/CronJobColumns";
import { CronJobDataTable } from "@/components/ui/data-table/CronJobDataTable";
import { useAuth } from "@/hooks/shared/useAuth";
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ApprovedPortfolio {
    id: string;
    title: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    approved: boolean;
    published: boolean;
    published_at: string | null;
    manual_publish: boolean | null;
    user: {
        id: string;
        username: string | null;
        full_name: string | null;
    };
}

export default function CronJobPage() {
    const { user, profile } = useAuth();
    const [portfolios, setPortfolios] = useState<ApprovedPortfolio[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [processingId, setProcessingId] = useState<string | null>(null);
    const [showSettings, setShowSettings] = useState(false);
    const [adminSettings, setAdminSettings] = useState<any>(null);
    const [isTesting, setIsTesting] = useState(false);

    // Fetch approved but unpublished portfolios
    const fetchApprovedPortfolios = async () => {
        try {
            setIsLoading(true);
            const supabase = createClient();

            const { data, error } = await supabase
                .from('portfolios')
                .select(`
                    id,
                    title,
                    description,
                    created_at,
                    updated_at,
                    approved,
                    published,
                    published_at,
                    manual_publish,
                    user:profiles!portfolios_user_id_fkey (
                        id,
                        username,
                        full_name
                    )
                `)
                .eq('approved', true)
                .eq('published', false)
                .is('deleted_at', null)
                .order('updated_at', { ascending: true }); // Neue approvals am Ende

            if (error) {
                console.error('Error fetching approved portfolios:', error);
                toast.error('Failed to load approved portfolios');
                return;
            }

            setPortfolios(data || []);
        } catch (error) {
            console.error('Error fetching approved portfolios:', error);
            toast.error('Failed to load approved portfolios');
        } finally {
            setIsLoading(false);
        }
    };

    // Unapprove portfolio (send back to management)
    const handleUnapprove = async (portfolioId: string) => {
        setProcessingId(portfolioId);
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('portfolios')
                .update({
                    status: 'pending',
                    approved: false,
                    updated_at: new Date().toISOString()
                })
                .eq('id', portfolioId);

            if (error) {
                throw new Error('Failed to unapprove portfolio');
            }

            toast.success('Portfolio sent back to management');

            // Remove from list since it's no longer approved
            setPortfolios(prev => prev.filter(p => p.id !== portfolioId));
        } catch (error) {
            console.error('Error unapproving portfolio:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to unapprove portfolio');
        } finally {
            setProcessingId(null);
        }
    };

    // Publish single portfolio
    const handlePublishNow = async (portfolioId: string) => {
        setProcessingId(portfolioId);
        try {
            const response = await fetch(`/api/admin/portfolios/${portfolioId}/publish`, {
                method: 'POST',
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to publish portfolio');
            }

            toast.success('Portfolio published successfully');

            // Remove from list since it's now published
            setPortfolios(prev => prev.filter(p => p.id !== portfolioId));
        } catch (error) {
            console.error('Error publishing portfolio:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to publish portfolio');
        } finally {
            setProcessingId(null);
        }
    };

    // Bulk publish portfolios
    const handleBulkAction = async (action: string, selectedIds: string[]) => {
        if (action === 'publish') {
            try {
                // Publish all selected portfolios
                const publishPromises = selectedIds.map(id =>
                    fetch(`/api/admin/portfolios/${id}/publish`, { method: 'POST' })
                );

                const results = await Promise.all(publishPromises);

                // Check if all were successful
                const failedCount = results.filter(r => !r.ok).length;

                if (failedCount === 0) {
                    toast.success(`${selectedIds.length} portfolios published successfully`);
                } else {
                    toast.error(`${failedCount} portfolios failed to publish`);
                }

                // Refresh the list
                await fetchApprovedPortfolios();
            } catch (error) {
                console.error('Error bulk publishing:', error);
                toast.error('Failed to publish portfolios');
            }
        }
    };


    // Run cron job manually
    const handleTestCron = async () => {
        setIsTesting(true);
        try {
            const response = await fetch('/api/admin/test-cron', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Cron job failed');
            }

            toast.success(`Cron job completed: ${result.result.message}`, {
                duration: 5000
            });

            // Refresh the portfolios list
            await fetchApprovedPortfolios();
        } catch (error) {
            console.error('Error running cron job:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to run cron job');
        } finally {
            setIsTesting(false);
        }
    };

    useEffect(() => {
        if (user && profile?.is_admin) {
            fetchApprovedPortfolios();
        }
    }, [user, profile]);

    // Refresh columns when adminSettings or portfolios change
    useEffect(() => {
        // This will trigger a re-render of the columns with updated data
    }, [adminSettings, portfolios]);

    if (!user || !profile?.is_admin) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-50">Access Denied</h1>
                    <p className="text-gray-600 dark:text-gray-400">Admin privileges required</p>
                </div>
            </div>
        );
    }

    // Create columns for the data table
    const columns = createCronJobColumns({
        onPublishNow: handlePublishNow,
        onUnapprove: handleUnapprove,
        processingId,
        adminSettings,
        portfolios
    });

    return (
        <div className="space-y-6">
            {/* Status Indicators */}
            {isTesting && (
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="text-blue-700 dark:text-blue-300 font-medium">
                        🚀 Running Cron Job...
                    </div>
                </div>
            )}

            {/* Settings Panel */}
            {showSettings && (
                <PublishSettings
                    onSettingsChange={setAdminSettings}
                />
            )}

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
            ) : portfolios.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                    <div className="text-gray-600 dark:text-gray-400 mb-4">
                        No approved portfolios waiting for publication
                    </div>
                    <p className="text-sm text-gray-500">
                        Portfolios will appear here after admin approval and before publishing
                    </p>
                </div>
            ) : (
                <CronJobDataTable
                    columns={columns}
                    data={portfolios}
                    onBulkAction={handleBulkAction}
                    weeklyLimit={adminSettings?.weekly_publish_limit || 5}
                    onToggleSettings={() => setShowSettings(!showSettings)}
                    onTestCron={handleTestCron}
                />
            )}
        </div>
    );
}
