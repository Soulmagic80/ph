import { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';

interface UseInfiniteScrollProps {
    hasMore: boolean;
    loadMore: () => void;
    threshold?: number;
    rootMargin?: string;
}

export function useInfiniteScroll({ hasMore, loadMore, threshold = 0, rootMargin = '100px' }: UseInfiniteScrollProps) {
    const { ref, inView } = useInView({
        threshold,
        rootMargin
    });

    useEffect(() => {
        if (inView && hasMore) {
            loadMore();
        }
    }, [inView, hasMore, loadMore]);

    return { ref };
} 