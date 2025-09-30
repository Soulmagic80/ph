import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

interface RandomPortfolio {
    id: string;
    title: string;
    feedbackCount: number;
}

interface UseRandomPortfolioReturn {
    isLoading: boolean;
    error: string | null;
    getRandomPortfolio: () => Promise<void>;
}

export function useRandomPortfolio(): UseRandomPortfolioReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const getRandomPortfolio = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/feedback/random-portfolio');
            const data = await response.json();

            if (!response.ok) {
                // Handle "no portfolios available" as a special case, not an error
                if (response.status === 404 && (data.error?.includes('No unrated portfolios') || data.error?.includes('No portfolios available'))) {
                    toast.info('Great job! You\'ve rated all available portfolios. Check back later for new ones!');
                    return;
                }
                throw new Error(data.error || 'Failed to get random portfolio');
            }

            if (data.success && data.portfolio) {
                const portfolio: RandomPortfolio = data.portfolio;
                
                // Navigate to the portfolio detail page
                router.push(`/${portfolio.id}`);
                
                // Optional: Show a toast with portfolio info
                toast.success(`Found "${portfolio.title}" for you to review (${portfolio.feedbackCount} previous ratings)`);
            } else {
                throw new Error('No portfolio data received');
            }

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Failed to get random portfolio';
            setError(errorMessage);
            
            // Show appropriate error messages
            if (errorMessage.includes('No portfolios available') || errorMessage.includes('No unrated portfolios')) {
                toast.info('Great job! You\'ve rated all available portfolios. Check back later for new ones!');
            } else if (errorMessage.includes('Authentication required')) {
                toast.error('Please sign in to give feedback');
                router.push('/auth/login');
            } else {
                toast.error('Failed to find a portfolio to rate. Please try again.');
            }
            
            console.error('Error getting random portfolio:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        error,
        getRandomPortfolio
    };
}
