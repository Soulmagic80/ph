import { createClient } from '@/lib/supabase';
import { Portfolio, PortfolioRanking } from '@/types';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

const ITEMS_PER_PAGE = 12;

export type RankingType = 'week' | 'month' | 'all_time';
type FilterType = 'week' | 'month' | 'all_time';

function getStartOfWeek(): Date {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
    return new Date(now.setDate(diff));
}

function getStartOfMonth(): Date {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function usePortfolios() {
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<Error | null>(null);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const [filter, setFilter] = useState<FilterType>('all_time');
    const currentFilter = useRef<FilterType>(filter);
    
    // Use useMemo to create a stable supabase client reference
    const supabase = useMemo(() => createClient(), []);

    const fetchPortfolios = useCallback(async (page: number): Promise<void> => {
        try {
            setIsLoading(true);
            setError(null);

            let query = supabase
                .from('portfolio_rankings')  // ✅ Read from materialized view instead
                .select('*')
                .order('current_rank', { ascending: true })  // Sort by rank (1, 2, 3...)
                .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

            // Apply date filtering based on selected filter
            if (currentFilter.current === 'week') {
                const startOfWeek = getStartOfWeek();
                query = query.gte('created_at', startOfWeek.toISOString());
            } else if (currentFilter.current === 'month') {
                const startOfMonth = getStartOfMonth();
                query = query.gte('created_at', startOfMonth.toISOString());
            }
            // 'all_time' doesn't need any date filtering

            const { data: portfoliosData, error: fetchError } = await query;

            if (fetchError) {
                console.error('Supabase query error:', fetchError);
                throw fetchError;
            }

            if (!portfoliosData) {
                throw new Error('No data returned from query');
            }

            // Transform PortfolioRanking (from materialized view) to Portfolio (app type)
            const transformedData: Portfolio[] = (portfoliosData as PortfolioRanking[]).map((ranking) => {
                return {
                    id: ranking.id,
                    title: ranking.title,
                    description: ranking.description,
                    image_url: ranking.images?.[0] || null, // First image from array
                    url: ranking.website_url,
                    images: ranking.images,
                    tags: ranking.tags,
                    style: ranking.style,
                    website_url: ranking.website_url,
                    slug: ranking.slug,
                    created_at: ranking.created_at,
                    updated_at: ranking.updated_at,
                    user_id: ranking.user_id,
                    current_rank: ranking.current_rank || 0,
                    previous_rank: null, // Not available in materialized view
                    rank_change: null, // Not available in materialized view
                    upvote_count: ranking.upvote_count || 0,
                    // DB fields
                    approved: ranking.approved,
                    published: ranking.published,
                    published_at: ranking.published_at,
                    status: ranking.status,
                    declined_reason: ranking.declined_reason,
                    deleted_at: ranking.deleted_at,
                    deleted_by: ranking.deleted_by,
                    rank_all_time: ranking.rank_all_time,
                    rank_all_time_best: ranking.rank_all_time_best,
                    rank_current_month: ranking.rank_current_month,
                    // Map flat username/full_name to nested user object
                    user: {
                        id: ranking.user_id,
                        username: ranking.username,
                        full_name: ranking.full_name
                    }
                };
            });

            // No need to sort - already sorted by current_rank in query

            setPortfolios(prev => page === 0 ? transformedData : [...prev, ...transformedData]);
            setHasMore(transformedData.length === ITEMS_PER_PAGE);
            setPage(page);
        } catch (err) {
            console.error('Error in fetchPortfolios:', err);
            setError(err instanceof Error ? err : new Error('Failed to fetch portfolios'));
            setHasMore(false);
        } finally {
            setIsLoading(false);
        }
    }, [supabase]);

    useEffect(() => {
        currentFilter.current = filter;
        fetchPortfolios(0);
    }, [filter, fetchPortfolios]);

    const handleUpvote = useCallback((portfolioId: string, newUpvoteCount: number) => {
        // Optimistically update the portfolio list and re-sort
        setPortfolios(prev => {
            // Update the upvote count for the affected portfolio
            const updated = prev.map(p => 
                p.id === portfolioId 
                    ? { ...p, upvote_count: newUpvoteCount }
                    : p
            );
            
            // Re-sort by upvote count (descending), then by published_at (descending)
            // This matches the sorting logic in the portfolio_rankings materialized view
            return updated.sort((a, b) => {
                // First, sort by upvote count (higher is better)
                if (b.upvote_count !== a.upvote_count) {
                    return b.upvote_count - a.upvote_count;
                }
                // If upvote counts are equal, sort by published_at (newer first)
                return new Date(b.published_at || b.created_at).getTime() - 
                       new Date(a.published_at || a.created_at).getTime();
            });
            // Note: We keep the old current_rank values from the materialized view
            // The ranks will be updated accurately every 10 minutes via pg_cron
            // This prevents incorrect rank calculations when not all portfolios are loaded
        });
    }, []);

    const loadMore = useCallback(() => {
        if (!isLoading && hasMore) {
            fetchPortfolios(page + 1);
        }
    }, [isLoading, hasMore, page, fetchPortfolios]);

    const handleFilterChange = useCallback((newFilter: FilterType) => {
        setFilter(newFilter);
        currentFilter.current = newFilter;
        setPage(0);
        setPortfolios([]);
        setHasMore(true);
    }, []);

    const refreshPortfolios = useCallback(async () => {
        setPage(0);
        setPortfolios([]);
        setHasMore(true);
        await fetchPortfolios(0);
    }, [fetchPortfolios]);

    return {
        portfolios,
        isLoading,
        error,
        hasMore,
        filter,
        loadMore,
        handleUpvote,
        handleFilterChange,
        refreshPortfolios
    };
} 