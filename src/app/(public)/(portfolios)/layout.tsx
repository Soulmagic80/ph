import { Navbar } from "@/components/ui/navigation/Navbar";

export default function PortfoliosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex min-h-screen">
            <Navbar />
            <main className="flex-1">
                {children}
            </main>
        </div>
    );
} 