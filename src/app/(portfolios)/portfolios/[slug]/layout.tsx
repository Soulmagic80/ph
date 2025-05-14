export default function PortfolioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white dark:bg-gray-950 min-h-screen">
            {children}
        </div>
    );
} 