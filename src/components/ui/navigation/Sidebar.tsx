"use client";
import { siteConfig } from "@/app/siteConfig";
import { AuthContext } from "@/components/AuthProvider";
import { Button } from "@/components/Button";
import { supabase } from "@/lib/supabase";
import { cx } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useContext, useState } from "react";
import MobileSidebar from "./MobileSidebar";
import { UserProfileDesktop, UserProfileMobile } from "./UserProfile";

const navigation = [
  { name: "HowTo", href: "/howto" },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, userEmail } = useContext(AuthContext);
  const [error, setError] = useState<string | null>(null);

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to sign out");
    }
  };

  const isActive = (itemHref: string) => {
    if (itemHref === siteConfig.baseLinks.user.profile) {
      return pathname.startsWith("/user");
    }
    return pathname === itemHref || pathname.startsWith(itemHref);
  };

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
            <UserProfileDesktop handleLogout={handleLogout} userEmail={userEmail} />
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
            <UserProfileMobile handleLogout={handleLogout} userEmail={userEmail} />
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