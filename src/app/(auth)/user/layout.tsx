"use client"
import Footer from "@/components/ui/Footer";
import { SectionLayout } from "@/components/layouts/SectionLayout";
import { useAuth } from "@/hooks/shared/useAuth";
import { cx } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";
import React from "react";

const baseNavigationTabs = [
  { id: "profile", label: "Profile", href: "/user/profile" },
  { id: "account", label: "Account", href: "/user/account" },
];

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { profile } = useAuth();

  // Filter tabs based on admin status
  const navigationTabs = profile?.is_admin
    ? baseNavigationTabs.filter(tab => tab.id === "profile" || tab.id === "account")
    : baseNavigationTabs;

  // Determine active tab based on pathname
  const activeTab = navigationTabs.find(tab => pathname === tab.href)?.id || "profile";

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
                title="User Area"
                subtitle="Manage your profile, upload portfolios, and track your submissions"
                tabs={navigationTabs}
                activeTab={activeTab}
                onTabChange={(tabId) => {
                  const tab = navigationTabs.find(t => t.id === tabId);
                  if (tab) router.push(tab.href);
                }}
                layoutId="user-area-tabs"
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
