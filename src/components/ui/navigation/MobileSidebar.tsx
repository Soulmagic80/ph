"use client";
import { AuthContext } from "@/components/core/AuthProvider";
import { Button } from "@/components/ui/Button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/Drawer";
import { Menu } from "lucide-react";
import Link from "next/link";
import { useContext } from "react";

export default function MobileSidebar() {
  const { isLoggedIn } = useContext(AuthContext);

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" aria-label="open sidebar" className="md:hidden p-1.5">
          <Menu className="size-6 shrink-0 text-gray-600 dark:text-gray-400" aria-hidden="true" />
        </Button>
      </DrawerTrigger>
      <DrawerContent className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 overflow-x-hidden sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <nav aria-label="core mobile navigation links" className="flex flex-1 flex-col space-y-10">
            <div className="flex flex-col gap-2">
              <Link href="/howto" className="flex items-center gap-x-2.5 rounded-md px-2 py-3 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50 transition-colors hover:bg-gray-100 dark:hover:bg-gray-900">
                How To
              </Link>
              <Link href="#" className="flex items-center gap-x-2.5 rounded-md px-2 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50 transition-colors hover:bg-gray-100 dark:hover:bg-gray-900">
                Community
              </Link>
              <Link href="#" className="flex items-center gap-x-2.5 rounded-md px-2 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 hover:dark:text-gray-50 transition-colors hover:bg-gray-100 dark:hover:bg-gray-900">
                Resources
              </Link>
            </div>
          </nav>
          {!isLoggedIn && (
            <div className="border-t pt-4 mt-4">
              <Link href="/login">
                <Button variant="primary" className="w-full">
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