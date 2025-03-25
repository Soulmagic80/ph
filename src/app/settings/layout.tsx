"use client"
import React from "react"

import { TabNavigation, TabNavigationLink } from "@/components/TabNavigation"
import { Sidebar } from "@/components/ui/navigation/Sidebar"
import { cx } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { siteConfig } from "../siteConfig"

const navigationSettings = [
  { name: "Audit", href: siteConfig.baseLinks.settings.audit },
  { name: "Billing & Usage", href: siteConfig.baseLinks.settings.billing },
  { name: "Users", href: siteConfig.baseLinks.settings.users },
]

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {

  const pathname = usePathname()
  return (
    <div className="mx-auto w-full">
      <Sidebar/>
      <div
        className={cx(
          "w-full",
          "ease transform-gpu overflow-x-hidden transition-all duration-100 will-change-transform lg:bg-gray-500 lg:py-0 lg:pr-0 lg:dark:bg-gray-950",
        )}
      >
        <div className="min-h-dvh bg-white p-6 pt-12 dark:bg-gray-925 lg:dark:border-gray-900">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Settings
          </h1>
          <TabNavigation className="mt-6">
            {navigationSettings.map((item) => (
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
          <div className="pt-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
