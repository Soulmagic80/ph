"use client";

import { Button } from "@/components/ui/Button";
import { navigationItems } from "@/config/navigation";
import { useAuth } from "@/hooks/shared/useAuth";
import { List } from "@phosphor-icons/react";
import { Session } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import MobileSidebar from "./MobileSidebar";
import { UserProfileDesktop, UserProfileMobile } from "./UserProfile";

interface NavbarProps {
  initialSession?: Session | null;
}

export function Navbar({ initialSession }: NavbarProps) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth(initialSession);

  const handleLogout = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Failed to sign out");
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/90 dark:bg-gray-950/80 backdrop-blur-sm border-b border-beige-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <nav className="flex h-16 items-center justify-between">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {/* Logo */}
          <Link href="/" aria-label="Home Link" className="flex items-center">
            <Image src="/logo-light.svg" alt="Logo" width={20} height={20} className="h-6 w-auto block dark:hidden" />
            <Image src="/logo-dark.svg" alt="Logo" width={20} height={20} className="h-6 w-auto hidden dark:block" />
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex flex-row gap-2 items-center">
                {navigationItems.map((item) => (
                  <Button key={item.name} variant="ghost" asChild className="text-xs font-normal">
                    <Link href={item.href}>{item.name}</Link>
                  </Button>
                ))}
              </div>
            </div>

            {/* Sign In Button / User Profile (nur ab md) */}
            <div className="hidden md:block">
              {loading ? (
                <div className="animate-pulse">
                  <div className="h-9 w-20 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
              ) : user ? (
                <UserProfileDesktop onSignOut={handleLogout} userEmail={user?.email || ""} />
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/auth/login">
                    <Button variant="ghost" className="text-sm font-normal border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/login/register">
                    <Button variant="primary" className="text-sm font-normal">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* User (nur unter md) */}
            {loading ? (
              <div className="md:hidden animate-pulse">
                <div className="h-8 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
              </div>
            ) : user && (
              <div className="md:hidden">
                <UserProfileMobile onSignOut={handleLogout} userEmail={user?.email || ""} />
              </div>
            )}

            {/* Burger Button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2"
              >
                <List size={20} />
              </Button>
            </div>

            {/* Mobile Sidebar */}
            <div className="md:hidden">
              <MobileSidebar
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
                onSignOut={handleLogout}
                user={user}
              />
            </div>
          </div>
        </nav>
      </div>
    </div>
  );
}