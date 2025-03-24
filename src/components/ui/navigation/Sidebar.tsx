// ✅ Sidebar.tsx
"use client"
import { siteConfig } from "@/app/siteConfig"
import { cx } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import MobileSidebar from "./MobileSidebar"
import { UserProfileMobile } from "./UserProfile"
import { Button } from "@/components/Button"

const navigation = [
  { name: "Settings", href: siteConfig.baseLinks.settings.audit },
] as const

export function Sidebar() {
  const pathname = usePathname()
  const isActive = (itemHref: string) => {
    if (itemHref === siteConfig.baseLinks.settings.audit) {
      return pathname.startsWith("/settings")
    }
    return pathname === itemHref || pathname.startsWith(itemHref)
  }

  return (
    <div className="w-full sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 dark:border-gray-800 dark:bg-gray-950">
      {/* Logo */}
      <Link href="/" aria-label="Home Link" className="flex items-center">
        <img src="/logo-light.svg" alt="Logo" className="h-7 w-auto block dark:hidden" />
        <img src="/logo-dark.svg" alt="Logo" className="h-7 w-auto hidden dark:block" />
      </Link>

      {/* Right side */}
      <div className="flex items-center gap-6">
        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-6">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cx(
                isActive(item.href)
                  ? "text-blue-600 dark:text-blue-400"
                  : "text-gray-700 dark:text-gray-300",
                "text-sm font-medium hover:text-blue-600 dark:hover:text-white"
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Sign In Button (nur ab md) */}
        <div className="hidden md:block">
          <Button variant="secondary" size="sm">
            Sign In
          </Button>
        </div>

        {/* User */}
        <UserProfileMobile />

        {/* Burger (<md) */}
        <div className="md:hidden">
          <MobileSidebar />
        </div>
      </div>
    </div>
  )
}