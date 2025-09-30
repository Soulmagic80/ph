"use client";
import PortfolioCard from "@/components/portfolio/card/PortfolioCard";
import { Portfolio } from "@/types";

interface PortfolioGridProps {
    portfolios: Portfolio[];
    onUpvote?: (id: string) => void;
    className?: string;
}

export function PortfolioGrid({
    portfolios,
    onUpvote,
    className = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
}: PortfolioGridProps) {
    return (
        <div className={`grid ${className}`}>
            {portfolios.map((portfolio) => (
                <PortfolioCard
                    key={portfolio.id}
                    portfolio={portfolio}
                    onUpvote={onUpvote}
                />
            ))}
        </div>
    );
} 