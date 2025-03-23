// ✅ MobileSidebar.tsx
import { siteConfig } from "@/app/siteConfig"
import { Button } from "@/components/Button"
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/Drawer"
import { cx, focusRing } from "@/lib/utils"

import { BarChartBig, Compass, Menu, Settings2, Table2 } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

const navigation = [
  { name: "Reports", href: siteConfig.baseLinks.reports, icon: BarChartBig },
  {
    name: "Transactions",
    href: siteConfig.baseLinks.transactions,
    icon: Table2,
  },
  {
    name: "Settings",
    href: siteConfig.baseLinks.settings.audit,
    icon: Settings2,
  },
] as const

export default function MobileSidebar() {
  const pathname = usePathname()
  const isActive = (itemHref: string) => {
    if (itemHref === siteConfig.baseLinks.settings.audit) {
      return pathname.startsWith("/settings")
    }
    return pathname === itemHref || pathname.startsWith(itemHref)
  }
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button
          variant="ghost"
          aria-label="open sidebar"
          className="md:hidden"
        >
          <Menu className="size-6 shrink-0 text-gray-600 dark:text-gray-400" aria-hidden="true" />
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
          <DrawerClose asChild>
            <Button variant="ghost">Close</Button>
          </DrawerClose>
        </DrawerHeader>
        <DrawerBody>
          <nav className="flex flex-col gap-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cx(
                  isActive(item.href)
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-gray-700 dark:text-gray-300",
                  "flex items-center gap-2 text-sm font-medium hover:text-blue-600 dark:hover:text-white"
                )}
              >
                <item.icon className="size-5" />
                {item.name}
              </Link>
            ))}
          </nav>
          <div className="border-t pt-4 mt-4">
            <Button variant="secondary" size="sm" className="w-full">
              Sign In
            </Button>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  )
}
