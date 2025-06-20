export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            {children}
        </div>
    );
} 