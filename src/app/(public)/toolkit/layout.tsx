export default function ToolkitLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="min-h-screen bg-white pt-16 dark:bg-gray-900">
            <div className="max-w-7xl mx-auto">
                <div className="px-5 md:px-10 py-10 pb-32">
                    {/* Content */}
                    {children}
                </div>
            </div>
        </div>
    );
}

