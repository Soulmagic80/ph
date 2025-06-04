"use client";
import { Portfolio } from "../types";
import PortfolioCard from "./PortfolioCard";

interface PortfolioGridProps {
    portfolios: Portfolio[];
    onUpvote?: (id: string) => void;
}

export default function PortfolioGrid({ portfolios, onUpvote }: PortfolioGridProps) {
    return (
        <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                {portfolios.map((portfolio, index) => (
                    <PortfolioCard
                        key={portfolio.id}
                        portfolio={portfolio}
                        {...(onUpvote ? { onUpvote } : {})}
                        rank={index + 1}
                    />
                ))}
            </div>
        </div>
    );
} 