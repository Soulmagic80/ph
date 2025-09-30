'use client';

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error(error);
    }, [error]);

    return (
        <main className="max-w-7xl px-5 md:px-10 py-10 mx-auto">
            <div className="p-6 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                <h2 className="text-lg font-semibold text-red-800 dark:text-red-200">Something went wrong!</h2>
                <p className="mt-2 text-red-700 dark:text-red-300">
                    {error.message || "An unexpected error occurred while loading the portfolio."}
                </p>
                <div className="mt-4 flex gap-4">
                    <button
                        onClick={reset}
                        className="px-4 py-2 bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-200 rounded-md hover:bg-red-200 dark:hover:bg-red-700 transition-colors"
                    >
                        Try again
                    </button>
                    <Link
                        href="/portfolios"
                        className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                        Browse Portfolios
                    </Link>
                </div>
            </div>
        </main>
    );
} 