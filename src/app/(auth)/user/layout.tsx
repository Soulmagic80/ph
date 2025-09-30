"use client"
import Footer from "@/components/ui/Footer";
import { Navbar } from "@/components/ui/navigation/Navbar";
import { TabNavigation, TabNavigationLink } from "@/components/ui/TabNavigation";
import { useAuth } from "@/hooks/shared/useAuth";
import { cx } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const baseNavigationTabs = [
  { name: "Profile", href: "/user/profile" },
  { name: "Account", href: "/user/account" },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { profile } = useAuth();


  // Filter tabs based on admin status
  const navigationTabs = profile?.is_admin
    ? baseNavigationTabs.filter(tab => tab.name === "Profile" || tab.name === "Account")
    : baseNavigationTabs;

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
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                  User Area
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  Manage your profile, upload portfolios, and track your submissions
                </p>
              </div>


              <TabNavigation className="mb-8">
                {navigationTabs.map((item) => (
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
