"use client";

import Footer from "@/components/ui/Footer";
import { SectionLayout } from "@/components/layouts/SectionLayout";
import { useAuth } from "@/hooks/shared/useAuth";
import { cx } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

const portfolioNavigationTabs = [
    { id: "overview", label: "Overview", href: "/portfolio/overview" },
    { id: "upload", label: "Upload", href: "/portfolio/upload" },
];

export default function PortfolioLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();
    const { user } = useAuth();

    // Determine active tab based on pathname
    const activeTab = portfolioNavigationTabs.find(tab => pathname === tab.href)?.id || "overview";

    // Redirect to login if not authenticated
    if (!user) {
        return null; // This will be handled by middleware
    }

    return (
        <div className="mx-auto w-full bg-lightbeige-100 dark:bg-gray-900">
            <div
                className={cx(
                    "w-full",
                    "ease transform-gpu overflow-x-hidden transition-all duration-100 will-change-transform lg:bg-gray-500 lg:py-0 lg:pr-0 lg:dark:bg-gray-900",
                )}
            >
                <div className="min-h-dvh bg-white pt-16 dark:bg-gray-900 lg:dark:border-gray-900">
                    <div className="mx-auto max-w-7xl">
                        <div className="px-5 md:px-10 py-10 pb-32">
                            <SectionLayout
                                title="My Portfolio"
                                subtitle="Upload your portfolio and check submission status"
                                tabs={portfolioNavigationTabs}
                                activeTab={activeTab}
                                onTabChange={(tabId) => {
                                    const tab = portfolioNavigationTabs.find(t => t.id === tabId);
                                    if (tab) router.push(tab.href);
                                }}
                                layoutId="portfolio-tabs"
                            >
                                <main>{children}</main>
                            </SectionLayout>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </div>
    );
}
