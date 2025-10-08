"use client"
import Footer from "@/components/ui/Footer";
import { SectionLayout } from "@/components/layouts/SectionLayout";
import { cx } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const adminNavigationTabs = [
    { id: "management", label: "Management", href: "/admin/portfolios" },
    { id: "uploads", label: "Uploads", href: "/admin/uploads" },
    { id: "cronjob", label: "CronJob", href: "/admin/cronjob" },
    { id: "toolkit", label: "Toolkit", href: "/admin/toolkit" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const router = useRouter();

    // Determine active tab based on pathname
    const activeTab = adminNavigationTabs.find(tab => pathname === tab.href)?.id || "management";

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
                                title="Admin Area"
                                subtitle="Manage portfolios, upload curated content, and oversee platform quality"
                                tabs={adminNavigationTabs}
                                activeTab={activeTab}
                                onTabChange={(tabId) => {
                                    const tab = adminNavigationTabs.find(t => t.id === tabId);
                                    if (tab) router.push(tab.href);
                                }}
                                layoutId="admin-tabs"
                            >
                                {children}
                            </SectionLayout>
                        </div>
                    </div>
                </div>
            </div >
            <Footer />
        </div >
    )
}


