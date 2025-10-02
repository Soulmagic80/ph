"use client";

import { Button } from "@/components/ui/Button";
import {
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/Drawer";
import { navigationItems } from "@/config/navigation";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onSignOut: () => void;
  user: User | null;
}

export default function MobileSidebar({ isOpen, onClose, user }: MobileSidebarProps) {
  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="bg-white dark:bg-gray-950 border-gray-200 dark:border-gray-800 overflow-x-hidden sm:max-w-lg">
        <DrawerHeader>
          <DrawerTitle>Menu</DrawerTitle>
        </DrawerHeader>
        <DrawerBody>
          <nav className="flex flex-col space-y-4">
            {/* Navigation items from config */}
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-2 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
                  onClick={onClose}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  <span>{item.name}</span>
                </Link>
              );
            })}

            {user ? null : (
              <Link href="/auth/login" onClick={onClose}>
                <Button variant="primary" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
          </nav>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}