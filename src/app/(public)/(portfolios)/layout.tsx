import { PageTransition } from "@/components/ui/PageTransition";

export default function PortfoliosLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <PageTransition>{children}</PageTransition>
    );
} 