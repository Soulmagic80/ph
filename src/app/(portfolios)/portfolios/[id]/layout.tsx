export default function PortfolioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="mx-auto w-full">
            {children}
        </div>
    );
} 