import { PageTransition } from "@/components/ui/PageTransition";
import { Navbar } from "@/components/ui/navigation/Navbar";

export default function PortfoliosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen relative">
            <Navbar />
            <main className="flex-1 relative">
                <PageTransition>{children}</PageTransition>
            </main>
        </div>
    );
} 