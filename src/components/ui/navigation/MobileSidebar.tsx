"use client";
import { AuthContext } from "@/components/AuthProvider";
import { Button } from "@/components/Button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/Drawer";
import { cx, focusRing } from "@/lib/utils";
import { BookOpen, Menu } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useContext } from "react";

const navigation = [
  {
    name: "HowTo",
    href: "/howto",
    icon: BookOpen,
  },
] as const;

export default function MobileSidebar() {
  const pathname = usePathname();
  const { isLoggedIn } = useContext(AuthContext);

  const isActive = (itemHref: string) => {
    return pathname === itemHref || pathname.startsWith(itemHref);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" aria-label="open sidebar" className="md:hidden p-1.5">
          <Menu className="size-6 shrink-0 text-gray-600 dark:text-gray-400" aria-hidden="true" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <nav aria-label="core mobile navigation links" className="flex flex-1 flex-col space-y-10">
            <div>
              <span className="block h-6 text-xs font-medium leading-6 text-gray-500 transition-opacity dark:text-gray-400">
                Portfoliohunt
              </span>
              <ul role="list" className="mt-1 space-y-1.5">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cx(
                        isActive(item.href)
                          ? "text-blue-600 dark:text-blue-500"
                          : "text-gray-600 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50",
                        "flex items-center gap-x-2.5 rounded-md px-2 py-1.5 text-base font-medium transition hover:bg-gray-100 sm:text-sm hover:dark:bg-gray-900",
                        focusRing,
                      )}
                    >
                      <item.icon className="size-5 shrink-0" aria-hidden="true" />
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>
          {!isLoggedIn && (
            <div className="border-t pt-4 mt-4">
              <Link href="/login">
                <Button variant="secondary" className="w-full">
                  Sign In
                </Button>
              </Link>
            </div>
          )}
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}