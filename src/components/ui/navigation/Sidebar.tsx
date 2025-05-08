"use client";
import { AuthContext } from "@/components/AuthProvider";
import { Button } from "@/components/Button";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useContext, useState } from "react";
import MobileSidebar from "./MobileSidebar";
import { UserProfileDesktop, UserProfileMobile } from "./UserProfile";

export function Sidebar() {
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
                <Link href="/howto" className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200">
                  How To
                </Link>
                <Link href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200">
                  Community
                </Link>
                <Link href="#" className="text-sm font-medium text-gray-700 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 transition-colors duration-200">
                  Resources
                </Link>
              </div>
            </div>

            {/* Sign In Button / User Profile (nur ab md) */}
            <div className="hidden md:block">
              {isLoggedIn ? (
                <UserProfileDesktop handleLogout={handleLogout} userEmail={userEmail} />
              ) : (
                <Link href="/login">
                  <Button variant="primary">
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
        </nav>
      </div>
    </div>
  );
}