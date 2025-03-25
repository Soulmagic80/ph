"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { siteConfig } from "@/app/siteConfig";
import { cx } from "@/lib/utils";
import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";
import MobileSidebar from "./MobileSidebar";
import { UserProfileDesktop, UserProfileMobile } from "./UserProfile";
import { Button } from "@/components/Button";

const navigation = [
  { name: "Settings", href: siteConfig.baseLinks.settings.audit },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null); // null = loading
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: userData, error } = await supabase.auth.getUser();
        if (error) throw error;
        setIsLoggedIn(!!userData.user);
        setUser(userData.user);
      } catch (err: any) {
        setError(err.message || "Failed to fetch user data");
        setIsLoggedIn(false);
        setUser(null);
      }
    };
    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session?.user);
      setUser(session?.user || null);
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setIsLoggedIn(false);
      setUser(null);
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Failed to sign out");
    }
  };

  const isActive = (itemHref: string) => {
    if (itemHref === siteConfig.baseLinks.settings.audit) {
      return pathname.startsWith("/settings");
    }
    return pathname === itemHref || pathname.startsWith(itemHref);
  };

  if (isLoggedIn === null) {
    return (
      <div className="w-full sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 dark:border-gray-800 dark:bg-gray-950">
        <Link href="/" aria-label="Home Link" className="flex items-center">
          <Image src="/logo-light.svg" alt="Logo" width={28} height={28} className="h-7 w-auto block dark:hidden" />
          <Image src="/logo-dark.svg" alt="Logo" width={28} height={28} className="h-7 w-auto hidden dark:block" />
        </Link>
        <div className="flex items-center gap-6">
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
          <div className="w-8 h-8 rounded-full border border-gray-300 bg-gray-200 animate-pulse" />
          <div className="md:hidden">
            <MobileSidebar />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 dark:border-gray-800 dark:bg-gray-950">
      {error && <div className="text-red-500 text-sm">{error}</div>}
      {/* Logo */}
      <Link href="/" aria-label="Home Link" className="flex items-center">
        <Image src="/logo-light.svg" alt="Logo" width={28} height={28} className="h-7 w-auto block dark:hidden" />
        <Image src="/logo-dark.svg" alt="Logo" width={28} height={28} className="h-7 w-auto hidden dark:block" />
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

        {/* Sign In Button / User Profile (nur ab md) */}
        <div className="hidden md:block">
          {isLoggedIn ? (
            <UserProfileDesktop handleLogout={handleLogout} userEmail={user?.email || "Unknown"} />
          ) : (
            <Link href="/login">
              <Button variant="secondary">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* User (nur unter md) */}
        {isLoggedIn && (
          <div className="md:hidden">
            <UserProfileMobile handleLogout={handleLogout} userEmail={user?.email || "Unknown"} />
          </div>
        )}

        {/* Burger */}
        <div className="md:hidden">
          <MobileSidebar />
        </div>
      </div>
    </div>
  );
}