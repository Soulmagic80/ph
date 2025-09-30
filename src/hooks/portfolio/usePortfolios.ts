import { createClient } from '@/lib/supabase';
import { Portfolio } from '@/types';
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
                .from('portfolios')
                .select(`
                    *,
                    profiles!portfolios_user_id_fkey (
                        username,
                        full_name
                    )
                `)
                .eq('published', true)
                .is('deleted_at', null)  // Exclude soft-deleted portfolios
                .order('created_at', { ascending: false })
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

            // Get ranking data for these portfolios via API route
            const portfolioIds = portfoliosData.map((p: any) => p.id);
            const rankingResponse = await fetch('/api/portfolios/rankings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ portfolioIds }),
            });

            if (!rankingResponse.ok) {
                throw new Error('Failed to fetch ranking data');
            }

            const { rankings: rankingData } = await rankingResponse.json();

            // Create a map for quick lookup
            const rankingMap = new Map();
            if (rankingData) {
                rankingData.forEach((item: any) => {
                    rankingMap.set(item.id, {
                        current_rank: item.current_rank,
                        upvote_count: item.upvote_count
                    });
                });
            }

            const transformedData: Portfolio[] = portfoliosData.map((portfolio: any) => {
                const ranking = rankingMap.get(portfolio.id);
                return {
                    id: portfolio.id,
                    title: portfolio.title,
                    description: portfolio.description,
                    image_url: portfolio.image_url,
                    url: portfolio.url,
                    images: portfolio.images,
                    tags: portfolio.tags,
                    style: portfolio.style,
                    website_url: portfolio.website_url,
                    slug: portfolio.slug,
                    created_at: portfolio.created_at,
                    updated_at: portfolio.updated_at,
                    user_id: portfolio.user_id,
                    current_rank: ranking?.current_rank || 0,
                    previous_rank: null, // Not available in current data
                    rank_change: null, // Not available in current data
                    upvote_count: ranking?.upvote_count || 0,
                    // New fields from DB schema
                    approved: portfolio.approved,
                    published: portfolio.published,
                    status: portfolio.status,
                    declined_reason: portfolio.declined_reason,
                    deleted_at: portfolio.deleted_at,
                    deleted_by: portfolio.deleted_by,
                    rank_all_time: portfolio.rank_all_time,
                    rank_all_time_best: portfolio.rank_all_time_best,
                    rank_current_month: portfolio.rank_current_month,
                    user: portfolio.profiles
                };
            });

            // Sort by current_rank (null and 0 values last)
            transformedData.sort((a, b) => {
                const rankA = a.current_rank || 0;
                const rankB = b.current_rank || 0;
                
                // Both have no rank (0 or null) - sort by creation date (newest first)
                if (rankA === 0 && rankB === 0) {
                    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
                }
                
                // One has no rank - put it last
                if (rankA === 0) return 1;
                if (rankB === 0) return -1;
                
                // Both have ranks - sort by rank (1, 2, 3...)
                return rankA - rankB;
            });

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

    const handleUpvote = useCallback(async () => {
        try {
            await fetchPortfolios(0);
        } catch (error) {
            console.error('Error refreshing portfolios after upvote:', error);
        }
    }, [fetchPortfolios]);

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

    return {
        portfolios,
        isLoading,
        error,
        hasMore,
        filter,
        loadMore,
        handleUpvote,
        handleFilterChange
    };
} 