"use client";
import { siteConfig } from "@/app/siteConfig";
import { Button } from "@/components/Button";
import {
  Drawer,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/Drawer";
import { cx } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { usePathname, useRouter } from "next/navigation";
import { Menu, Settings2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const navigation = [
  {
    name: "Settings",
    href: siteConfig.baseLinks.settings.audit,
    icon: Settings2,
  },
] as const;

export default function MobileSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      setIsLoggedIn(!!userData.user);
    };
    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setIsLoggedIn(!!session?.user);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    router.push("/login");
  };

  const isActive = (itemHref: string) => {
    if (itemHref === siteConfig.baseLinks.settings.audit) {
      return pathname.startsWith("/settings");
    }
    return pathname === itemHref || pathname.startsWith(itemHref);
  };

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="ghost" aria-label="open sidebar" className="md:hidden">
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
            {isLoggedIn ? (
              <Button variant="secondary" size="sm" className="w-full" onClick={handleLogout}>
                Sign Out
              </Button>
            ) : (
              <Link href="/login">
                <Button variant="secondary" size="sm" className="w-full">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}