"use client";

import { cx, focusRing } from "@/lib/utils";
import { User } from "lucide-react";
import { DropdownUserProfile } from "./DropdownUserProfile";
import { Button } from "@/components/Button";

interface UserProfileProps {
  handleLogout: () => void;
  userEmail: string;
  isCollapsed?: boolean;
}

export const UserProfileDesktop = ({ handleLogout, userEmail, isCollapsed }: UserProfileProps) => {
  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : "U";

  return (
    <DropdownUserProfile handleLogout={handleLogout} userEmail={userEmail}>
      <Button
        aria-label="User settings"
        variant="ghost"
        className={cx(
          isCollapsed ? "justify-center" : "justify-between",
          focusRing,
          "group flex w-full items-center rounded-md px-1 py-1 text-sm font-medium text-gray-900 hover:bg-gray-200/50 data-[state=open]:bg-gray-200/50 hover:dark:bg-gray-800/50 data-[state=open]:dark:bg-gray-900",
        )}
      >
        {isCollapsed ? (
          // h-8 to avoid layout shift with icon shown in isCollapsibled == false
          <div className="flex h-8 items-center">
            <User
              className="size-5 shrink-0 text-gray-500 group-hover:text-gray-700 dark:text-gray-500 group-hover:dark:text-gray-300"
              aria-hidden="true"
            />
          </div>
        ) : (
          <span className="flex items-center gap-4">
            <span
              className={cx(
                isCollapsed ? "size-5" : "size-8",
                "flex shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300",
              )}
              aria-hidden="true"
            >
              {initial}
            </span>
          </span>
        )}
      </Button>
    </DropdownUserProfile>
  );
};

export const UserProfileMobile = ({ handleLogout, userEmail }: UserProfileProps) => {
  const initial = userEmail ? userEmail.charAt(0).toUpperCase() : "U";

  return (
    <DropdownUserProfile align="end" handleLogout={handleLogout} userEmail={userEmail}>
      <Button
        aria-label="User settings"
        variant="ghost"
        className={cx(
          "group flex items-center rounded-md p-0.5 sm:p-1 text-sm font-medium text-gray-900 hover:bg-gray-200/50 data-[state=open]:bg-gray-200/50 hover:dark:bg-gray-800/50 data-[state=open]:dark:bg-gray-800/50",
        )}
      >
        <span
          className="flex size-8 sm:size-7 shrink-0 items-center justify-center rounded-full border border-gray-300 bg-white text-xs text-gray-700 dark:border-gray-800 dark:bg-gray-950 dark:text-gray-300"
          aria-hidden="true"
        >
          {initial}
        </span>
      </Button>
    </DropdownUserProfile>
  );
};