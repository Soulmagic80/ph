"use client"
import { siteConfig } from "@/app/siteConfig"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/Tabs"
import { Sidebar } from "@/components/ui/navigation/Sidebar"
import { cx } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import React from "react"

const navigationSettings = [
  { name: "Profile", href: siteConfig.baseLinks.user.profile },
  { name: "Account", href: siteConfig.baseLinks.user.account },
  { name: "Social", href: siteConfig.baseLinks.user.social },
]

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname()

  return (
    <div className="mx-auto w-full">
      <Sidebar />
      <div
        className={cx(
          "w-full",
          "ease transform-gpu overflow-x-hidden transition-all duration-100 will-change-transform lg:bg-gray-500 lg:py-0 lg:pr-0 lg:dark:bg-gray-950",
        )}
      >
        <div className="min-h-dvh bg-white pt-12 dark:bg-gray-925 lg:dark:border-gray-900">
          <div className="mx-auto max-w-7xl p-8">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              User Settings
            </h1>
            <Tabs defaultValue={pathname} className="mt-6">
              <TabsList>
                {navigationSettings.map((item) => (
                  <TabsTrigger
                    key={item.name}
                    value={item.href}
                    asChild
                  >
                    <Link href={item.href}>{item.name}</Link>
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
            <div className="pt-6">{children}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
