"use client";

import { PageTransition } from "@/components/ui/PageTransition";
import { Navbar } from "@/components/ui/navigation/Navbar";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="bg-white dark:bg-gray-900 min-h-screen">
            <Navbar />
            <PageTransition>{children}</PageTransition>
        </div>
    );
} 