"use client";

import { TabNavigation, TabNavigationLink } from "@/components/ui/TabNavigation";
import Link from "next/link";
import { usePathname } from "next/navigation";

const toolkitTabs = [
    { name: "Tools", href: "/toolkit" },
    { name: "Templates", href: "/toolkit/templates" },
    { name: "Links", href: "/toolkit/links" },
];

export default function ToolkitLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    return (
        <div className="min-h-screen bg-white pt-16 dark:bg-gray-950">
            <div className="max-w-7xl mx-auto">
                <div className="px-5 md:px-10 py-10 pb-32">
                    {/* Header */}
                    <div className="mb-12">
                        <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                            Toolkit
                        </h1>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            Essential resources for designers
                        </p>
                    </div>

                    {/* Tab Navigation */}
                    <TabNavigation className="mb-8">
                        {toolkitTabs.map((tab) => (
                            <TabNavigationLink
                                key={tab.name}
                                asChild
                                active={pathname === tab.href}
                                className="px-5"
                            >
                                <Link href={tab.href}>{tab.name}</Link>
                            </TabNavigationLink>
                        ))}
                    </TabNavigation>

                    {/* Content */}
                    {children}
                </div>
            </div>
        </div>
    );
}

