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
import { Button } from "@/components/Button";

const navigation = [
  { name: "Settings", href: siteConfig.baseLinks.settings.audit },
] as const;

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const { data: userData } = await supabase.auth.getUser();
      if (userData.user) {
        setIsLoggedIn(true);
        setUser(userData.user);

        const { data: files, error } = await supabase.storage
          .from("avatars")
          .list(userData.user.id, { limit: 1, search: "avatar" });
        if (!error && files && files.length > 0) {
          const avatarExt = files[0].name.split(".").pop();
          setAvatarUrl(
            `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${userData.user.id}/avatar.${avatarExt}`
          );
        }
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setAvatarUrl(null);
      }
    };
    fetchUserData();

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setIsLoggedIn(true);
        setUser(session.user);

        supabase.storage
          .from("avatars")
          .list(session.user.id, { limit: 1, search: "avatar" })
          .then(({ data: files, error }) => {
            if (!error && files && files.length > 0) {
              const avatarExt = files[0].name.split(".").pop();
              setAvatarUrl(
                `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/${session.user.id}/avatar.${avatarExt}`
              );
            }
          });
      } else {
        setIsLoggedIn(false);
        setUser(null);
        setAvatarUrl(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setIsLoggedIn(false);
    setUser(null);
    setAvatarUrl(null);
    router.push("/login");
  };

  const Avatar = () => {
    if (avatarUrl) {
      return (
        <Image
          src={avatarUrl}
          alt="User Avatar"
          width={32}
          height={32}
          className="rounded-full border-2 border-black"
          onError={() => setAvatarUrl(null)}
        />
      );
    }
    const initial = user?.email ? user.email.charAt(0).toUpperCase() : "U";
    return (
      <div className="w-8 h-8 rounded-full border-2 border-black flex items-center justify-center bg-gray-200">
        <span className="text-gray-800 font-bold text-lg">{initial}</span>
      </div>
    );
  };

  const isActive = (itemHref: string) => {
    if (itemHref === siteConfig.baseLinks.settings.audit) {
      return pathname.startsWith("/settings");
    }
    return pathname === itemHref || pathname.startsWith(itemHref);
  };

  return (
    <div className="w-full sticky top-0 z-40 flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 sm:px-6 dark:border-gray-800 dark:bg-gray-950">
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

        {/* Sign In Button / Avatar (nur ab md) */}
        <div className="hidden md:block">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Avatar />
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="secondary" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* User (nur unter md) */}
        <div className="md:hidden">
          {isLoggedIn ? (
            <div className="flex items-center gap-2">
              <Avatar />
              <Button variant="secondary" size="sm" onClick={handleLogout}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="secondary" size="sm">
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Burger */}
        <div className="md:hidden">
          <MobileSidebar />
        </div>
      </div>
    </div>
  );
}