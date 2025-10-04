"use client"
import Footer from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/navigation/Navbar";
import { TabNavigation, TabNavigationLink } from "@/components/ui/TabNavigation";
import { cx } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const adminNavigationTabs = [
    { name: "Management", href: "/admin/portfolios" },
    { name: "Uploads", href: "/admin/uploads" },
    { name: "CronJob", href: "/admin/cronjob" },
    { name: "Toolkit", href: "/admin/toolkit" },
];

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="mx-auto w-full bg-lightbeige-100 dark:bg-gray-950">
            <Navbar />
            <div
                className={cx(
                    "w-full",
                    "ease transform-gpu overflow-x-hidden transition-all duration-100 will-change-transform lg:bg-gray-500 lg:py-0 lg:pr-0 lg:dark:bg-gray-950",
                )}
            >
                <div className="min-h-dvh bg-white pt-16 dark:bg-gray-950 lg:dark:border-gray-900">
                    <div className="mx-auto max-w-7xl">
                        <div className="px-5 md:px-10 py-10 pb-32">
                            <div className="mb-12">
                                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                                    Admin Area
                                </h1>
                                <p className="text-base text-gray-600 dark:text-gray-400 mt-1">
                                    Manage portfolios, upload curated content, and oversee platform quality
                                </p>
                            </div>

                            <TabNavigation className="mb-8">
                                {adminNavigationTabs.map((item) => (
                                    <TabNavigationLink
                                        key={item.name}
                                        asChild
                                        active={pathname === item.href}
                                        className="px-5"
                                    >
                                        <Link href={item.href}>{item.name}</Link>
                                    </TabNavigationLink>
                                ))}
                            </TabNavigation>

                            {children}
                        </div>
                    </div>
                </div>
            </div >
            <Footer />
        </div >
    )
}


