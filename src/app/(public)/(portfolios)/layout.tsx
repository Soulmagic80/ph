import { Navbar } from "@/components/ui/navigation/Navbar";

export default function PortfoliosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen relative">
            {/* Vertical lines - Light mode */}
            <div className="absolute inset-0 pointer-events-none dark:hidden flex justify-center">
                <div className="w-full max-w-7xl px-5 md:px-10 h-full relative">
                    {/* Left line */}
                    <div className="absolute left-5 md:left-10 top-0 bottom-0 w-[1px]" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 4px, transparent 4px, transparent 8px)' }} />
                    {/* Center line */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px]" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 4px, transparent 4px, transparent 8px)' }} />
                    {/* Right line */}
                    <div className="absolute right-5 md:right-10 top-0 bottom-0 w-[1px]" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, rgba(0,0,0,0.06) 0px, rgba(0,0,0,0.06) 4px, transparent 4px, transparent 8px)' }} />
                </div>
            </div>
            {/* Vertical lines - Dark mode */}
            <div className="absolute inset-0 pointer-events-none hidden dark:flex justify-center">
                <div className="w-full max-w-7xl px-5 md:px-10 h-full relative">
                    {/* Left line */}
                    <div className="absolute left-5 md:left-10 top-0 bottom-0 w-[1px]" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 4px, transparent 4px, transparent 8px)' }} />
                    {/* Center line */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[1px]" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 4px, transparent 4px, transparent 8px)' }} />
                    {/* Right line */}
                    <div className="absolute right-5 md:right-10 top-0 bottom-0 w-[1px]" style={{ backgroundImage: 'repeating-linear-gradient(to bottom, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 4px, transparent 4px, transparent 8px)' }} />
                </div>
            </div>
            <Navbar />
            <main className="flex-1 relative z-10">
                {children}
            </main>
        </div>
    );
} 