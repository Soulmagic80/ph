import Link from "next/link";

export function HeroTwo() {
    return (
        <div className="w-full flex flex-col items-start text-left gap-6 pt-24 sm:pt-30 md:pt-36 lg:pt-40 xl:pt-40 pb-20 sm:pb-28 md:pb-36 lg:pb-40 relative">
            {/* Aurora Background - Dark Mode Only */}
            <div className="absolute inset-0 hidden dark:block pointer-events-none">
                {/* Pink Blob - Top Left */}
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-pink-500/20 rounded-full blur-[120px] opacity-35"></div>
                {/* Blue Blob - Top Right */}
                <div className="absolute top-20 right-0 w-[800px] h-[500px] bg-blue-500/25 rounded-full blur-[120px] opacity-35"></div>
                {/* Pink Blob - Bottom Left */}
                <div className="absolute bottom-0 left-20 w-[400px] h-[400px] bg-pink-600/15 rounded-full blur-[100px] opacity-35"></div>
            </div>

            {/* Übertitel - kleiner und grau wie "BUILT FOR" auf Tremor */}
            <p className="text-[11px] sm:text-xs font-geist-sans font-medium tracking-[0.15em] text-gray-500 dark:text-gray-400 uppercase relative z-10">
                Home of Design Portfolios
            </p>

            {/* Main heading - linksbündig */}
            <h1 className="text-[36px] sm:text-[40px] md:text-[44px] lg:text-[48px] xl:text-[64px] font-geist-sans font-bold max-w-5xl tracking-[-0.06em] leading-[1.05] text-supergrey-100 dark:text-gray-50 relative z-10">
                Get feedback.
                
                Get upvotes.
                <br />
                Get <span className="relative inline-block bg-gradient-to-r from-pink-100 to-[#3474DB] dark:from-pinkdark-200 dark:to-[#3474DB] bg-clip-text text-transparent">
                    noticed.
                    <svg
                        className="absolute -bottom-3 left-0 w-full h-4"
                        viewBox="0 0 200 16"
                        preserveAspectRatio="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="gradient-pink-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#FF006A', stopOpacity: 0.65 }} />
                                <stop offset="100%" style={{ stopColor: '#3474DB', stopOpacity: 0.65 }} />
                            </linearGradient>
                            <linearGradient id="gradient-pink-blue-2" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#FF006A', stopOpacity: 0.75 }} />
                                <stop offset="100%" style={{ stopColor: '#3474DB', stopOpacity: 0.75 }} />
                            </linearGradient>
                            <linearGradient id="gradient-pink-blue-3" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#FF006A', stopOpacity: 0.8 }} />
                                <stop offset="100%" style={{ stopColor: '#3474DB', stopOpacity: 0.8 }} />
                            </linearGradient>
                            <linearGradient id="gradient-pink-blue-4" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#FF006A', stopOpacity: 0.85 }} />
                                <stop offset="100%" style={{ stopColor: '#3474DB', stopOpacity: 0.85 }} />
                            </linearGradient>
                        </defs>
                        {/* Erste Linie - etwas versetzt */}
                        <path
                            d="M5 7 Q98 4, 195 8"
                            stroke="url(#gradient-pink-blue)"
                            strokeWidth="3.5"
                            fill="none"
                            strokeLinecap="round"
                        />
                        {/* Zweite Linie - überlappt leicht */}
                        <path
                            d="M2 8.5 Q102 5, 198 9"
                            stroke="url(#gradient-pink-blue-2)"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                        />
                        {/* Dritte Linie - wieder anders versetzt */}
                        <path
                            d="M4 11 Q100 7.5, 196 11.5"
                            stroke="url(#gradient-pink-blue-3)"
                            strokeWidth="3.5"
                            fill="none"
                            strokeLinecap="round"
                        />
                        {/* Vierte Linie - kräftigste, auch versetzt */}
                        <path
                            d="M3 13 Q99 9.5, 197 13.5"
                            stroke="url(#gradient-pink-blue-4)"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </svg>
                </span>
            </h1>

            {/* Subtitle - linksbündig */}
            <p className="text-base sm:text-lg font-geist-sans font-normal leading-[1.6] text-gray-600 dark:text-gray-400 max-w-2xl relative z-10">
            Share your portfolio, get feedback, grow your visibility.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 mt-4">
                <Link
                    href="/getting-started"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 text-white bg-[#3474DB] hover:bg-[#3474DB]/90 dark:bg-[#3474DB] dark:hover:bg-[#3474DB]/90 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3474DB] focus-visible:ring-offset-2 relative z-10"
                >
                    Get Started
                </Link>
                <a
                    href="#portfolios"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 border border-gray-300 bg-transparent text-gray-900 hover:bg-gray-50 dark:border-gray-800 dark:bg-transparent dark:text-gray-50 dark:hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 relative z-10"
                >
                    Browse Portfolios
                </a>
            </div>
        </div>
    );
}
