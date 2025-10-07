"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSubMenu,
  DropdownMenuSubMenuContent,
  DropdownMenuSubMenuTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { useAuth } from "@/hooks/shared/useAuth";
import { cx } from "@/lib/utils";
import { Briefcase, LogOut, Monitor, Moon, Settings, Shield, Sun, UserCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import * as React from "react";

export type DropdownUserProfileProps = {
  children: React.ReactNode;
  onSignOut: () => void;
  userEmail: string;
};

export function DropdownUserProfile({
  children,
  onSignOut,
  userEmail,
}: DropdownUserProfileProps) {
  const [mounted, setMounted] = React.useState(false);
  const [open, setOpen] = React.useState(false);
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const { profile } = useAuth();

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleNavigation = (href: string) => {
    setOpen(false);
    router.push(href);
  };

  return (
    <>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)} suppressHydrationWarning>{children}</DropdownMenuTrigger>
        <DropdownMenuContent
          className={cx(
            "z-50 min-w-[11rem] overflow-hidden rounded-md border bg-white p-1 text-gray-900 shadow-md dark:border-gray-700/50 dark:bg-gray-850 dark:text-gray-50",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
          )}
          sideOffset={5}
          onMouseEnter={() => setOpen(true)}
          onMouseLeave={() => setOpen(false)}
        >
          <DropdownMenuLabel>{userEmail}</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuSubMenu>
              <DropdownMenuSubMenuTrigger>Theme</DropdownMenuSubMenuTrigger>
              <DropdownMenuSubMenuContent>
                <DropdownMenuRadioGroup
                  value={theme}
                  onValueChange={(value) => {
                    setTheme(value);
                  }}
                >
                  <DropdownMenuRadioItem
                    aria-label="Switch to Light Mode"
                    value="light"
                    iconType="check"
                  >
                    <Sun className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                    Light
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    aria-label="Switch to Dark Mode"
                    value="dark"
                    iconType="check"
                  >
                    <Moon className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                    Dark
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    aria-label="Switch to System Mode"
                    value="system"
                    iconType="check"
                  >
                    <Monitor className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                    System
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubMenuContent>
            </DropdownMenuSubMenu>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => handleNavigation("/user/profile")} className="gap-x-3.5">
              <UserCircle className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleNavigation("/user/account")} className="gap-x-3.5">
              <Settings className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              Account
            </DropdownMenuItem>
            {profile?.is_admin ? (
              <DropdownMenuItem onClick={() => handleNavigation("/admin/portfolios")} className="gap-x-3.5">
                <Shield className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                Admin
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem onClick={() => handleNavigation("/portfolio/overview")} className="gap-x-3.5">
                <Briefcase className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                My Portfolio
              </DropdownMenuItem>
            )}
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={onSignOut} className="gap-x-3.5">
              <LogOut className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}