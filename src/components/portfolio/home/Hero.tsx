import Link from "next/link";

export function Hero() {
    const dotColor = encodeURIComponent('#9ca3af'); // gray-400
    const gap = 15;
    const dotSize = 1.2;

    return (
        <div className="w-full flex flex-col items-center text-center gap-6 pt-12 sm:pt-16 md:pt-20 lg:pt-24 xl:pt-28 pb-16 sm:pb-20 md:pb-24 relative">
            {/* Background Dots with fade on all sides */}
            <div
                className="absolute inset-0 h-full w-full pointer-events-none"
                style={{
                    backgroundColor: 'transparent',
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='${gap}' height='${gap}' viewBox='0 0 ${gap} ${gap}' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='${dotColor}' fill-opacity='0.15' fill-rule='evenodd'%3E%3Ccircle cx='${dotSize}' cy='${dotSize}' r='${dotSize}'/%3E%3C/g%3E%3C/svg%3E")`,
                    maskImage: 'linear-gradient(to right, transparent 0%, white 20%, white 80%, transparent 100%), linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%)',
                    WebkitMaskImage: 'linear-gradient(to right, transparent 0%, white 20%, white 80%, transparent 100%), linear-gradient(to bottom, transparent 0%, white 15%, white 85%, transparent 100%)',
                    maskComposite: 'intersect',
                    WebkitMaskComposite: 'source-in',
                }}
            />

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
            <div className="flex items-center gap-3 mt-6">
                <Link
                    href="/getting-started"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 relative z-10"
                >
                    Get Started
                </Link>
                <a
                    href="#portfolios"
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium h-10 px-4 py-2 border border-gray-300 bg-white text-gray-900 shadow-sm hover:bg-gray-50 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50 dark:hover:bg-gray-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-2 relative z-10"
                >
                    Browse Portfolios
                </a>
            </div>
        </div>
    );
}