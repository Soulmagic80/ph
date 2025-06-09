"use client";

import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { AuthChangeEvent, Session } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import MobileSidebar from "./MobileSidebar";
import { UserProfileDesktop, UserProfileMobile } from "./UserProfile";

const supabase = createClient();

export function Sidebar() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<{ email: string | undefined } | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ? { email: session.user.email } : null);
    };
    getUser();

    // Add auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ? { email: session.user.email } : null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-lightbeige-100/80 dark:bg-gray-950/80 backdrop-blur-sm border-b border-beige-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-5 md:px-10">
        <nav className="flex h-16 items-center justify-between">
          {error && <div className="text-red-500 text-sm">{error}</div>}
          {/* Logo */}
          <Link href="/" aria-label="Home Link" className="flex items-center">
            <Image src="/logo-light.svg" alt="Logo" width={20} height={20} className="h-6 w-auto block dark:hidden" />
            <Image src="/logo-dark.svg" alt="Logo" width={20} height={20} className="h-6 w-auto hidden dark:block" />
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-6">
            {/* Nav Links */}
            <div className="hidden md:flex items-center gap-6">
              <div className="flex flex-row gap-6 items-center">
                <Link href="/howto" className="text-sm font-normal text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200">
                  How To
                </Link>
                <Link href="#" className="text-sm font-normal text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200">
                  Community
                </Link>
                <Link href="#" className="text-sm font-normal text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200">
                  Resources
                </Link>
              </div>
            </div>

            {/* Sign In Button / User Profile (nur ab md) */}
            <div className="hidden md:block">
              {user ? (
                <UserProfileDesktop onSignOut={handleLogout} userEmail={user?.email || ""} />
              ) : (
                <Link href="/login">
                  <Button variant="primary">
                    Sign In
                  </Button>
                </Link>
              )}
            </div>

            {/* User (nur unter md) */}
            {user && (
              <div className="md:hidden">
                <UserProfileMobile onSignOut={handleLogout} userEmail={user?.email || ""} />
              </div>
            )}

            {/* Burger */}
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