"use client";
import PortfolioCard from "@/components/PortfolioCard";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/Select";
import { supabase } from "@/lib/supabase";
import { Portfolio } from "@/types";
import { CalendarIcon, TrophyIcon } from "@heroicons/react/24/outline";
import { User } from "@supabase/supabase-js";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const [selectedRanking, setSelectedRanking] = useState("current_month");

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        console.log("Fetching initial data...");
        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError) {
          console.error("Error fetching user:", userError);
        } else {
          console.log("User data:", userData);
          setUser(userData.user);
        }

        console.log("Fetching portfolios...");
        await fetchPortfolios(0);
      } catch (error) {
        console.error("Error in initial fetch:", error);
        setHasMore(false);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (page === 0) {
      setPortfolios([]);
      fetchPortfolios(0);
    }
  }, [selectedRanking]);

  const fetchPortfolios = async (page: number) => {
    try {
      console.log("Fetching portfolios for page:", page);

      let query = supabase
        .from("portfolios")
        .select("*");

      // Filter for current month if selected
      if (selectedRanking === "current_month") {
        const startOfMonth = new Date();
        startOfMonth.setDate(1);
        startOfMonth.setHours(0, 0, 0, 0);

        query = query
          .gte("created_at", startOfMonth.toISOString())
          .order("upvotes", { ascending: false })
          .order("created_at", { ascending: true });
      } else {
        // For all time best, sort by upvotes and then by creation date
        query = query
          .order("upvotes", { ascending: false })
          .order("created_at", { ascending: true });
      }

      console.log("Executing query...");
      const { data, error } = await query
        .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      console.log("Received portfolios:", data?.length, data);

      if (data && data.length > 0) {
        setPortfolios((prev) => {
          const updated = [...prev, ...data];
          // Ensure unique portfolios and sort by upvotes and creation date
          const uniquePortfolios = Array.from(new Map(updated.map((p) => [p.id, p])).values())
            .sort((a, b) => {
              if (b.upvotes === a.upvotes) {
                return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
              }
              return b.upvotes - a.upvotes;
            });
          console.log("Updated portfolios:", uniquePortfolios.length);
          return uniquePortfolios;
        });
        setHasMore(data.length === ITEMS_PER_PAGE);
      } else {
        console.log("No more portfolios to load");
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error in fetchPortfolios:", error);
      setHasMore(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpvote = async (portfolioId: string) => {
    if (!user) return;

    const isAdmin = user.email === "admin@example.com";

    if (!isAdmin) {
      const { data: existingVote, error: voteError } = await supabase
        .from("upvotes")
        .select("id")
        .eq("user_id", user.id)
        .eq("portfolio_id", portfolioId)
        .single();

      if (voteError && voteError.code !== "PGRST116") {
        console.error("Vote check failed:", voteError.message);
        return;
      }

      if (existingVote) {
        console.log("User has already upvoted this portfolio");
        return;
      }

      const { error: insertError } = await supabase
        .from("upvotes")
        .insert({ user_id: user.id, portfolio_id: portfolioId });

      if (insertError) {
        console.error("Insert vote failed:", insertError.message);
        return;
      }
    }

    // Upvote erhöhen
    const { data: currentPortfolio, error: fetchError } = await supabase
      .from("portfolios")
      .select("upvotes")
      .eq("id", portfolioId)
      .single();

    if (fetchError) {
      console.error("Fetch failed:", fetchError.message);
      return;
    }

    const newUpvotes = currentPortfolio.upvotes + 1;

    const { error: updateError } = await supabase
      .from("portfolios")
      .update({ upvotes: newUpvotes })
      .eq("id", portfolioId);

    if (updateError) {
      console.error("Upvote failed:", updateError.message);
      return;
    }

    // Alle Portfolios laden und Ränge berechnen
    const { data: allPortfolios, error: allError } = await supabase
      .from("portfolios")
      .select("*")
      .order("upvotes", { ascending: false });

    if (allError) {
      console.error("Fetch all portfolios failed:", allError.message);
      return;
    }

    // All Time Ränge
    const allTimeRanked = allPortfolios.map((p, index) => ({
      ...p,
      rank_all_time: index + 1,
    }));

    // Ränge in DB aktualisieren
    const { error: rankUpdateError } = await supabase.from("portfolios").upsert(allTimeRanked, {
      onConflict: "id",
      ignoreDuplicates: false,
    });

    if (rankUpdateError) {
      console.error("Rank update failed:", rankUpdateError.message);
      return;
    }

    // Lokale State-Aktualisierung
    setPortfolios((prev) =>
      prev
        .map((p) =>
          p.id === portfolioId
            ? { ...p, upvotes: p.upvotes + 1, rank_all_time: allTimeRanked.find(r => r.id === p.id)?.rank_all_time }
            : p
        )
        .sort((a, b) => b.upvotes - a.upvotes)
    );
  };

  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore) {
          const nextPage = page + 1;
          setPage(nextPage);
          fetchPortfolios(nextPage);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);
    observerRef.current = observer;

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
    };
  }, [page, hasMore]);

  const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });

  const handleFilterChange = (value: string) => {
    setSelectedRanking(value);
    setPortfolios([]);
    setPage(0);
    setHasMore(true);
  };

  return (
    <main className="max-w-7xl px-5 md:px-10 py-10 mx-auto">
      <div className="w-full flex flex-col gap-6 pt-[160px] pb-[120px]">
        <h1 className="text-[36px] text-supergrey-100 font-geist-sans font-semibold w-full min-w-[250px] text-left text-balance tracking-[-0.03em] leading-[120%]">
          Get feedback.
          <br />
          Get upvotes.
          <br />
          Get <span className="text-pink-100 dark:text-pinkdark-200">noticed.</span>
        </h1>
        <p className="text-[18px] lg:text-[18px] font-geist-sans font-light leading-[150%] text-gray-600 w-full text-left max-w-[640px]">
          Submit your portfolio, earn upvotes and valuable feedback from the design community, help others and maximize your visibility.
        </p>
      </div>

      <div className="flex items-center justify-between mb-7">
        <h2 className="text-[14px] font-medium pl-1 text-gray-900 dark:text-gray-50">
          Top Portfolios in {currentMonth}
        </h2>
        <div className="relative z-10">
          <Select defaultValue="current_month" onValueChange={handleFilterChange}>
            <SelectTrigger className="w-[180px] text-sm">
              <SelectValue placeholder="Select a filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current_month">
                <div className="flex items-center gap-3 text-sm">
                  <CalendarIcon className="h-4 w-4" />
                  Current month
                </div>
              </SelectItem>
              <SelectItem value="all_time">
                <div className="flex items-center gap-3 text-sm">
                  <TrophyIcon className="h-4 w-4" />
                  All time best
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading indicator */}
      {isLoading && (
        <div className="w-full text-center py-4">
          <p className="text-gray-500">Loading portfolios...</p>
        </div>
      )}

      {/* Load more indicator */}
      {!isLoading && hasMore && (
        <div ref={loadMoreRef} className="w-full text-center py-4">
          <p className="text-gray-500">Loading more...</p>
        </div>
      )}

      {/* Portfolio-Listen */}
      <div id="portfolios-section" className="pb-10 grid grid-cols-[repeat(auto-fit,minmax(320px,1fr))] gap-8">
        {portfolios.map((p) => (
          <PortfolioCard
            key={p.id}
            portfolio={p}
            user={user}
            onUpvote={handleUpvote}
            rank={portfolios.indexOf(p) + 1}
          />
        ))}
      </div>
    </main>
  );
}