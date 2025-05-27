"use client";
import { Button } from "@/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/Dialog";
import { supabase } from "@/lib/supabase";
import { Medal } from "@phosphor-icons/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Portfolio } from "../types";

interface PortfolioCardProps {
  portfolio: Portfolio;
  onUpvote: (id: string) => void;
  rank?: number;
}

export default function PortfolioCard({ portfolio, onUpvote, rank }: PortfolioCardProps) {
  const router = useRouter();
  const [isUpvoting, setIsUpvoting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [upvotes, setUpvotes] = useState(portfolio.upvotes);

  const handleUpvote = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      // Get current session
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        console.log("No session found, redirecting to login");
        router.push("/login");
        return;
      }

      console.log("Upvote clicked, user:", session.user.email);
      setIsUpvoting(true);

      const isAdmin = session.user.email === "admin@example.com";
      console.log("Is admin:", isAdmin);

      if (!isAdmin) {
        const { data: existingVote, error: voteError } = await supabase
          .from("portfolio_upvotes")
          .select("id")
          .eq("user_id", session.user.id)
          .eq("portfolio_id", portfolio.id)
          .maybeSingle();

        if (voteError) {
          console.error("Vote check failed:", voteError);
          alert("Failed to check if you've already upvoted");
          return;
        }

        if (existingVote) {
          console.log("User has already upvoted this portfolio");
          setIsModalOpen(true);
          return;
        }

        const { error: insertError } = await supabase
          .from("portfolio_upvotes")
          .insert({ user_id: session.user.id, portfolio_id: portfolio.id });

        if (insertError) {
          console.error("Insert vote failed:", insertError);
          alert("Failed to record your upvote");
          return;
        }

        // Update local upvotes count
        setUpvotes(prev => prev + 1);
      }

      if (onUpvote) {
        onUpvote(portfolio.id);
      }
    } catch (error) {
      console.error("Error in handleUpvote:", error);
      alert("An error occurred while upvoting");
    } finally {
      setIsUpvoting(false);
    }
  };

  // Bild-URL aus Storage
  const imageSrc = portfolio.images?.[0]
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio-images/${portfolio.images[0]}`
    : null;

  // Erste 3 Tags oder leer
  const displayTags = portfolio.tags?.slice(0, 2) || [];

  // Always use the ID for the link
  const portfolioLink = `/${portfolio.id}`;

  return (
    <>
      <div className="w-full h-fit bg-white dark:bg-gray-900 outline outline-1 outline-gray-200 dark:outline-gray-800 rounded-md hover:outline-4 hover:outline-[#3474DB] transition-all duration-200 p-2">
        <Link href={portfolioLink} className="block w-full rounded-md">
          <div className="w-full rounded-md aspect-[300/205] outline-md outline-1 outline-[#F5F2F0] dark:outline-gray-800 overflow-hidden">
            {imageSrc ? (
              <Image
                src={imageSrc}
                alt={portfolio.title}
                width={300}
                height={205}
                className="object-cover w-full h-full rounded-lg"
              />
            ) : (
              <div className="w-full bg-gray-100 dark:bg-gray-900 rounded-lg aspect-[300/205]"></div>
            )}
          </div>
        </Link>
        <div className="w-full h-auto mt-2.5 flex items-center gap-4 px-3 py-2">
          <span className="text-5xl font-geist font-semibold text-black dark:text-white">{rank || 2}</span>
          <div className="flex-1 flex flex-col">
            <h2 className="text-base pl-0.5 font-geist font-medium text-black dark:text-white">{portfolio.title}</h2>
            <div className="flex flex-row gap-1.5 mt-1.5">
              {displayTags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-md bg-gray-50 dark:bg-gray-800 px-1.5 py-0.5 text-[10px] font-geist font-medium text-gray-600 dark:text-gray-300 ring-1 ring-inset ring-gray-500/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {rank === 1 && <Medal className="w-6 h-6 text-yellow-500" weight="fill" />}
            {rank === 2 && <Medal className="w-6 h-6 text-gray-400" weight="fill" />}
            {rank === 3 && <Medal className="w-6 h-6 text-amber-700" weight="fill" />}
            <button
              onClick={handleUpvote}
              disabled={isUpvoting}
              className={`w-11 h-11 min-w-11 min-h-11 bg-white dark:bg-gray-900 border-[2px] border-[#000000] dark:border-gray-700 rounded-md flex flex-col items-center justify-center gap-0 hover:border-[#FF006A] dark:hover:border-[#FF006A] ${isUpvoting ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Image src="/upvote.svg" alt="Upvote" width={12} height={12} className={`dark:invert ${isUpvoting ? 'animate-pulse' : ''}`} />
              <span className="text-xs font-geist font-semibold text-black dark:text-white">{upvotes}</span>
            </button>
          </div>
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Already Upvoted</DialogTitle>
            <DialogDescription className="mt-1 text-sm leading-6">
              You have already upvoted this portfolio. Each portfolio can only be upvoted once.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6">
            <Button
              variant="primary"
              className="mt-2 w-full sm:mt-0 sm:w-fit bg-[#3474DB] hover:bg-[#2B5FB3] dark:bg-[#3474DB] dark:hover:bg-[#2B5FB3]"
              onClick={() => setIsModalOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}