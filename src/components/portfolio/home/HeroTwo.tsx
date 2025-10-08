import Link from "next/link";
import { Button } from "@/components/ui/Button";
/*import { DotGrid } from "@/components/ui/DotGrid";*/

export function HeroTwo() {
    return (
        <div className="w-full flex flex-col items-start text-left gap-6 pt-16 sm:pt-20 md:pt-24 lg:pt-28 xl:pt-32 pb-20 sm:pb-28 md:pb-36 lg:pb-32 relative">
            {/* Dot Grid Background - Dark Mode Only */}
            {/* <div className="hidden dark:block">
                <DotGrid 
                    dotSize={1.5} 
                    gap={20} 
                    color="#FFFFFF" 
                    hoverColor="blue-primary" 
                    hoverRadius={100} 
                />
            </div> */}

            {/* Aurora Background - Dark Mode Only */}
            <div className="absolute inset-0 hidden dark:block pointer-events-none">
                {/* Pink Blob - Top Left */}
                <div className="absolute top-0 left-0 w-[600px] h-[600px] rounded-full opacity-30" 
                     style={{ background: 'radial-gradient(circle, rgba(255, 0, 106, 0.2) 0%, rgba(255, 0, 106, 0.05) 40%, transparent 70%)' }}></div>
                
                {/* Blue Blob - Top Right */}
                <div className="absolute top-20 right-0 w-[900px] h-[600px] rounded-full opacity-30" 
                     style={{ background: 'radial-gradient(circle, rgba(52, 116, 219, 0.25) 0%, rgba(52, 116, 219, 0.08) 40%, transparent 70%)' }}></div>
                
                {/* Pink Blob - Bottom Left */}
                <div className="absolute bottom-0 left-20 w-[500px] h-[500px] rounded-full opacity-30" 
                     style={{ background: 'radial-gradient(circle, rgba(255, 0, 106, 0.15) 0%, rgba(255, 0, 106, 0.04) 40%, transparent 70%)' }}></div>
            </div>

            {/* Übertitel - kleiner und grau wie "BUILT FOR" auf Tremor */}
            <p className="text-[11px] sm:text-xs font-geist-sans font-medium tracking-[0.15em] text-gray-500 dark:text-gray-400 uppercase relative z-10">
                Home of Design Portfolios
            </p>

            {/* Main heading - linksbündig */}
            <h1 className="heading-hero-md font-geist-sans max-w-5xl relative z-10">
                Get feedback.
                <br />
                Get upvotes.
                <br />
                Get <span className="relative inline-block text-[#F42683]/100">
                    {/* bg-gradient-to-r from-[#FF006A] to-blue-primary dark:from-from-[#FF006A] dark:to-blue-primary bg-clip-text text-transparent */}
                    noticed.
                    
                    {/* <svg
                        className="absolute -bottom-3 left-0 w-full h-4"
                        viewBox="0 0 200 16"
                        preserveAspectRatio="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="gradient-pink-blue" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#FF006A', stopOpacity: 0.65 }} />
                                <stop offset="100%" style={{ stopColor: 'var(--blue-primary)', stopOpacity: 0.65 }} />
                            </linearGradient>
                            <linearGradient id="gradient-pink-blue-2" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#FF006A', stopOpacity: 0.75 }} />
                                <stop offset="100%" style={{ stopColor: 'var(--blue-primary)', stopOpacity: 0.75 }} />
                            </linearGradient>
                            <linearGradient id="gradient-pink-blue-3" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#FF006A', stopOpacity: 0.8 }} />
                                <stop offset="100%" style={{ stopColor: 'var(--blue-primary)', stopOpacity: 0.8 }} />
                            </linearGradient>
                            <linearGradient id="gradient-pink-blue-4" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" style={{ stopColor: '#FF006A', stopOpacity: 0.85 }} />
                                <stop offset="100%" style={{ stopColor: 'var(--blue-primary)', stopOpacity: 0.85 }} />
                            </linearGradient>
                        </defs>
                        <path
                            d="M5 7 Q98 4, 195 8"
                            stroke="url(#gradient-pink-blue)"
                            strokeWidth="3.5"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <path
                            d="M2 8.5 Q102 5, 198 9"
                            stroke="url(#gradient-pink-blue-2)"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <path
                            d="M4 11 Q100 7.5, 196 11.5"
                            stroke="url(#gradient-pink-blue-3)"
                            strokeWidth="3.5"
                            fill="none"
                            strokeLinecap="round"
                        />
                        <path
                            d="M3 13 Q99 9.5, 197 13.5"
                            stroke="url(#gradient-pink-blue-4)"
                            strokeWidth="4"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </svg> */}
                </span>
            </h1>

            {/* Subtitle - linksbündig */}
            <p className="text-body font-geist-sans pt-2 max-w-2xl relative z-10">
            Share your portfolio, get real feedback, grow your visibility.
            </p>

            {/* CTA Buttons */}
            <div className="flex items-center gap-3 mt-4">
                <Button
                    asChild
                    variant="primary"
                    className="relative z-10"
                >
                    <Link href="/getting-started">
                        Get Started
                    </Link>
                </Button>
                <Button
                    asChild
                    variant="secondary"
                    className="relative z-10"
                >
                    <a href="#portfolios">
                        Browse Portfolios
                    </a>
                </Button>
            </div>
        </div>
    );
}
