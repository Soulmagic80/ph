"use client";

import OptimizedImage from "@/components/ui/OptimizedImage";
import { useUpvote } from "@/hooks/portfolio/useUpvote";
import { useAuth } from "@/hooks/shared/useAuth";
import { getPortfolioMainImageUrl } from "@/lib/imageUtils";
import { createClient } from "@/lib/supabase";
import { Portfolio } from "@/types";
// Removed lucide icons - using emoji medals instead
import Link from "next/link";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface PortfolioCardProps {
  portfolio: Portfolio;
  onUpvote?: (id: string, newUpvoteCount: number) => void;
}

export default function PortfolioCard({ portfolio, onUpvote }: PortfolioCardProps) {

  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();
  const supabase = createClient();

  // Bild-URL aus Storage (NEW STRUCTURE)
  const imageSrc = getPortfolioMainImageUrl(portfolio);

  // Erste 3 Tags oder leer
  const displayTags = portfolio.tags?.slice(0, 2) || [];

  // Always use the ID for the link
  const portfolioLink = `/${portfolio.id}`;

  useEffect(() => {
    async function checkAdminStatus() {
      if (!user) {
        setIsAdmin(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', user.id)
          .single();

        if (error) {
          console.error('Error checking admin status:', error);
          return;
        }

        setIsAdmin((data as any)?.is_admin || false);
      } catch (err) {
        console.error('Exception checking admin status:', err);
      }
    }

    checkAdminStatus();
  }, [user, supabase]);

  const { upvoteCount, isUpvoted, isLoading: isUpvoting, toggleUpvote } = useUpvote({
    portfolioId: portfolio.id,
    userId: user?.id ?? null,
    initialUpvoteCount: portfolio.upvote_count ?? 0,
    isAdmin
  });

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      window.location.href = "/auth/login";
      return;
    }

    if (!isAdmin && isUpvoted) {
      toast.info("You have already upvoted this portfolio");
      return;
    }

    try {
      const newUpvoteCount = await toggleUpvote();
      if (onUpvote) {
        // Pass the new upvote count to parent for optimistic re-sorting
        onUpvote(portfolio.id, newUpvoteCount);
      }
    } catch (error) {
      console.error("Error in handleUpvote:", error);
    }
  };

  // Format rank change for display
  const formatRankChange = (change: number | null) => {
    if (change === null) return null;
    if (change > 0) return `↑${change}`;
    if (change < 0) return `↓${Math.abs(change)}`;
    return null;
  };

  return (
    <>
      <Link href={portfolioLink} className="block w-full h-fit bg-white dark:bg-gray-800 outline outline-1 outline-beige-300 dark:outline-gray-800 rounded-lg hover:scale-[1.03] hover:shadow-lg transition-all duration-200 relative group">
        {/* Plus symbols at corners - COMMENTED OUT FOR NOW */}
        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute h-6 w-6 -top-3 -left-3 text-black/[0.2] dark:text-white/[0.2] transition-colors duration-200">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6"></path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute h-6 w-6 -bottom-3 -left-3 text-black/[0.2] dark:text-white/[0.2] transition-colors duration-200">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6"></path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute h-6 w-6 -top-3 -right-3 text-black/[0.2] dark:text-white/[0.2] transition-colors duration-200">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6"></path>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="absolute h-6 w-6 -bottom-3 -right-3 text-black/[0.2] dark:text-white/[0.2] transition-colors duration-200">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6"></path>
        </svg> */}

        <div className="w-full aspect-[3/2] outline-1 outline-beige-300 dark:outline-gray-900 overflow-hidden rounded-t-lg">
          {imageSrc ? (
            <OptimizedImage
              src={imageSrc}
              alt={portfolio.title}
              width={400}
              height={267}
              className="w-full h-full object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              quality={85}
            />
          ) : (
            <div className="w-full bg-gray-100 dark:bg-gray-925 aspect-[3/2]"></div>
          )}
        </div>

        <div className="w-full h-auto flex items-center gap-4 px-4 pt-4 pb-4">
          <div className="flex flex-col items-center">
            <span className="text-5xl font-geist font-semibold text-black dark:text-white">{portfolio.current_rank}</span>
            {portfolio.rank_change && (
              <span className={`text-xs font-geist ${portfolio.rank_change > 0 ? 'text-green-500' : portfolio.rank_change < 0 ? 'text-red-500' : 'text-gray-500'}`}>
                {formatRankChange(portfolio.rank_change)}
              </span>
            )}
          </div>
          <div className="flex-1 flex flex-col min-w-0">
            <h2 className="text-base pl-0.5 font-geist font-medium text-black dark:text-white truncate">{portfolio.title}</h2>
            <div className="flex flex-row gap-1.5 mt-1.5">
              {displayTags.map((tag: string, index: number) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-geist font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2 relative z-10">
            {portfolio.current_rank === 1 && <span className="text-2xl">🥇</span>}
            {portfolio.current_rank === 2 && <span className="text-2xl">🥈</span>}
            {portfolio.current_rank === 3 && <span className="text-2xl">🥉</span>}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleUpvote(e);
              }}
              disabled={isUpvoting}
              className={`w-11 h-11 min-w-11 min-h-11 bg-white dark:bg-gray-800 border-[2px] border-[#000000] dark:border-gray-700/50 rounded-md flex flex-col items-center justify-center gap-0 hover:border-blue-primary dark:hover:border-gray-700/50 dark:hover:bg-gray-800 group/upvote ${isUpvoting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <OptimizedImage src="/upvote.svg" alt="Upvote" width={12} height={12} className={`dark:invert ${isUpvoting ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-geist font-semibold text-black dark:text-white">{upvoteCount}</span>
            </button>
          </div>
        </div>
      </Link>


    </>
  );
}