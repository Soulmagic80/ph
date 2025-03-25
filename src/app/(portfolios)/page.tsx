"use client";
import { supabase } from "@/lib/supabase";
import { useState, useEffect, useRef } from "react";
import PortfolioCard from "@/components/PortfolioCard";
import { Portfolio } from "@/types";
import { User } from "@supabase/supabase-js";

export default function Home() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);

  const ITEMS_PER_PAGE = 12;

  useEffect(() => {
    async function fetchData() {
      const { data: userData } = await supabase.auth.getUser();
      setUser(userData.user);
      await fetchPortfolios(0);
    }
    fetchData();
  }, []);

  const fetchPortfolios = async (page: number) => {
    const { data, error } = await supabase
      .from("portfolios")
      .select("*")
      .order("upvotes", { ascending: false })
      .range(page * ITEMS_PER_PAGE, (page + 1) * ITEMS_PER_PAGE - 1);

    if (!error && data) {
      setPortfolios((prev) => {
        const updated = [...prev, ...data];
        const uniquePortfolios = Array.from(new Map(updated.map((p) => [p.id, p])).values());
        return uniquePortfolios;
      });
      setHasMore(data.length === ITEMS_PER_PAGE);
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

  return (
    <main className="w-full mx-auto bg-white dark:bg-gray-925">
      <div className="w-full h-[380px] flex flex-col items-center justify-center gap-2">
        <p className="pb-4 text-[12px] text-blue-500 uppercase font-normal leading-[150%] tracking-[0.03em] mt-4 mb-4 max-w-[540px]">
          A new home for digital portfolios
        </p>
        <h1 className="text-4xl font-bold max-w-[700px] text-center text-balance tracking-[-0.03em] leading-[120%]">
          Challenge the best, get valuable feedback, improve, and help others.
        </h1>
        <p className="text-[17.5px] text-balance leading-[150%] mt-4 text-gray-500 text-center max-w-[540px] pb-8">
          Submit your portfolio, upvote, comment on, and rate other portfolios, and get real and helpful feedback on your own.
        </p>
      </div>

      {/* Portfolio-Listen */}
      <div className="p-4 pb-10 grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-6">
        {portfolios.map((p) => (
          <PortfolioCard
            key={p.id}
            portfolio={p}
            user={user}
            onUpvote={handleUpvote}
            rank={portfolios.indexOf(p) + 1}
          />
        ))}
        {hasMore && (
          <div ref={loadMoreRef} className="h-10 w-full flex justify-center items-center">
            Loading more...
          </div>
        )}
      </div>
    </main>
  );
}