"use client";
import PortfolioCard from "@/components/portfolio/card/PortfolioCard";
import { Portfolio } from "@/types";
import { motion } from "framer-motion";

interface PortfolioGridProps {
    portfolios: Portfolio[];
    onUpvote?: (id: string, newUpvoteCount: number) => void;
    className?: string;
}

export function PortfolioGrid({
    portfolios,
    onUpvote,
    className = "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
}: PortfolioGridProps) {
    return (
        <div className="relative">
            <div className={`grid ${className}`}>
                {portfolios.map((portfolio, index) => (
                    <motion.div
                        key={portfolio.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.4,
                            delay: index < 8 ? index * 0.08 : 0, // First 8: stagger, rest: instant
                            ease: "easeOut"
                        }}
                    >
                        <PortfolioCard
                            portfolio={portfolio}
                            onUpvote={onUpvote}
                        />
                    </motion.div>
                ))}
            </div>
        </div>
    );
}