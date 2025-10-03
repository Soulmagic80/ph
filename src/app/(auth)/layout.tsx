import { PageTransition } from "@/components/ui/PageTransition";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            <PageTransition>{children}</PageTransition>
        </div>
    );
} 