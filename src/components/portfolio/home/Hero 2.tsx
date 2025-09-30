export function Hero() {
    return (
        <div className="w-full flex flex-col items-center text-center gap-6 pt-12 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-28 pb-16 sm:pb-20 md:pb-24 lg:pb-[120px]">
            {/* Übertitel - kleiner und grau wie "BUILT FOR" auf Tremor */}
            <p className="text-[11px] sm:text-xs font-geist-sans font-medium tracking-[0.15em] text-gray-500 dark:text-gray-400 uppercase">
                Home of Design Portfolios
            </p>

            {/* Main heading */}
            <h1 className="text-[36px] sm:text-[40px] md:text-[44px] lg:text-[48px] xl:text-[56px] font-geist-sans font-bold max-w-5xl text-balance tracking-[-0.06em] leading-[1.05] text-gray-900 dark:text-gray-50">
                Get feedback. Get upvotes.
                <br />
                Get <span className="relative inline-block text-pink-100 dark:text-pinkdark-200">
                    noticed
                    <svg
                        className="absolute -bottom-3 left-0 w-full h-4"
                        viewBox="0 0 200 16"
                        preserveAspectRatio="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        {/* Erste Linie - etwas versetzt */}
                        <path
                            d="M5 7 Q98 4, 195 8"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            fill="none"
                            strokeLinecap="round"
                            opacity="0.65"
                        />
                        {/* Zweite Linie - überlappt leicht */}
                        <path
                            d="M2 8.5 Q102 5, 198 9"
                            stroke="currentColor"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                            opacity="0.75"
                        />
                        {/* Dritte Linie - wieder anders versetzt */}
                        <path
                            d="M4 11 Q100 7.5, 196 11.5"
                            stroke="currentColor"
                            strokeWidth="3.5"
                            fill="none"
                            strokeLinecap="round"
                            opacity="0.8"
                        />
                        {/* Vierte Linie - kräftigste, auch versetzt */}
                        <path
                            d="M3 13 Q99 9.5, 197 13.5"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                            opacity="0.85"
                        />
                    </svg>
                </span>{' '}
                and get hired.
            </h1>

            {/* Subtitle - gleiche Schriftgröße wie Tremor */}
            <p className="text-base text-balance sm:text-lg font-geist-sans font-normal leading-[1.6] text-gray-600 dark:text-gray-400 max-w-2xl">
                Submit your portfolio, earn upvotes and valuable feedback from the design community. Help others and maximize your visibility.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-4 mt-4">
                <a
                    href="/getting-started"
                    className="inline-flex items-center justify-center px-6 py-3 text-md font-semibold text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-lg transition-colors duration-200 shadow-sm"
                >
                    Get Started
                </a>
                <a
                    href="#portfolios"
                    className="inline-flex items-center justify-center px-6 py-3 text-sm font-semibold text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors duration-200"
                >
                    Browse Portfolios
                </a>
            </div>
        </div>
    );
}