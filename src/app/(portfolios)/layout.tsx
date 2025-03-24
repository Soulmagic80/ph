"use client";
import React, { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/ui/navigation/Sidebar"

export default function PortfoliosLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };
  const pathname = usePathname();

  return (
    <div className="mx-auto w-full">
      <Sidebar isCollapsed={isCollapsed} toggleSidebar={toggleSidebar} />
      <div
        className={`w-full transform-gpu overflow-x-hidden transition-all duration-100 will-change-transform bg-white p-6 pt-12 dark:bg-gray-925 lg:dark:border-gray-950`}
      >
        {children}
      </div>
    </div>
  );
}