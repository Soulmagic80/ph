"use client";
import { Medal } from "@phosphor-icons/react";
import { User } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Portfolio } from "../types";

interface PortfolioCardProps {
  portfolio: Portfolio;
  user: User | null;
  onUpvote: (id: string) => void;
  rank?: number;
}

export default function PortfolioCard({ portfolio, user, onUpvote, rank }: PortfolioCardProps) {
  const router = useRouter();

  const handleUpvoteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (user) {
      onUpvote(portfolio.id);
    } else {
      router.push("/login");
    }
  };

  // Bild-URL aus Storage
  const imageSrc = portfolio.images?.[0]
    ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio-images/${portfolio.images[0]}`
    : null;

  // Erste 3 Tags oder leer
  const displayTags = portfolio.tags?.slice(0, 2) || [];

  return (
    <div className="w-full h-fit bg-white dark:bg-gray-900 outline outline-1 outline-gray-200 dark:outline-gray-800 rounded-md hover:outline-4 hover:outline-[#3474DB] transition-all duration-200 p-2">
      <Link href={`/portfolios/${portfolio.id}`} className="block w-full rounded-md">
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
            onClick={handleUpvoteClick}
            className="w-11 h-11 min-w-11 min-h-11 bg-white dark:bg-gray-900 border-[2px] border-[#000000] dark:border-gray-700 rounded-md flex flex-col items-center justify-center gap-0 hover:border-[#FF006A] dark:hover:border-[#FF006A]"
          >
            <Image src="/upvote.svg" alt="Upvote" width={12} height={12} className="dark:invert" />
            <span className="text-xs font-geist font-semibold text-black dark:text-white">{portfolio.upvotes}</span>
          </button>
        </div>
      </div>
    </div>
  );
}