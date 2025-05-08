"use client";
import { User } from "@supabase/supabase-js";
import { useState } from "react";
import { Portfolio } from "../types";
import PortfolioCard from "./PortfolioCard";

interface PortfolioGridProps {
    portfolios: Portfolio[];
    user: User | null;
    onUpvote: (id: string) => void;
}

export default function PortfolioGrid({ portfolios, user, onUpvote }: PortfolioGridProps) {
    const [sortBy, setSortBy] = useState<"newest" | "top">("newest");

    const sortedPortfolios = [...portfolios].sort((a, b) => {
        if (sortBy === "newest") {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        } else {
            return b.upvotes - a.upvotes;
        }
    });

    return (
        <div className="w-full">
            <div className="flex justify-end mb-6">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setSortBy("newest")}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${sortBy === "newest"
                            ? "bg-[#3474DB] text-white"
                            : "bg-white text-[#3474DB] border border-[#3474DB]"
                            }`}
                    >
                        Newest
                    </button>
                    <button
                        onClick={() => setSortBy("top")}
                        className={`px-4 py-2 rounded-md text-sm font-medium ${sortBy === "top"
                            ? "bg-[#3474DB] text-white"
                            : "bg-white text-[#3474DB] border border-[#3474DB]"
                            }`}
                    >
                        Top
                    </button>
                </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {sortedPortfolios.map((portfolio, index) => (
                    <PortfolioCard
                        key={portfolio.id}
                        portfolio={portfolio}
                        user={user}
                        onUpvote={onUpvote}
                        rank={sortBy === "top" ? index + 1 : undefined}
                    />
                ))}
            </div>
        </div>
    );
} 