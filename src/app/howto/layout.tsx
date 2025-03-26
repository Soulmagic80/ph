"use client"

import { Sidebar } from "@/components/ui/navigation/Sidebar";
import { cx } from "@/lib/utils";
import React from "react";

export default function HowtoLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="mx-auto w-full">
            <Sidebar />
            <div
                className={cx(
                    "w-full",
                    "ease transform-gpu overflow-x-hidden transition-all duration-100 will-change-transform lg:bg-gray-500 lg:py-0 lg:pr-0 lg:dark:bg-gray-950",
                )}
            >
                <div className="min-h-dvh bg-white p-6 pt-12 dark:bg-gray-925 lg:dark:border-gray-900">
                    {children}
                </div>
            </div>
        </div>
    )
} 