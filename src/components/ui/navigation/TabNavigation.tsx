"use client"

import { cn } from "@/lib/utils"
import * as React from "react"

const TabNavigation = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 text-gray-500 dark:bg-gray-800 dark:text-gray-400",
            className
        )}
        {...props}
    />
))
TabNavigation.displayName = "TabNavigation"

const TabNavigationLink = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & {
        active?: boolean
        asChild?: boolean
    }
>(({ className, active, asChild, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-gray-950 dark:focus-visible:ring-gray-300",
            active
                ? "bg-white text-gray-950 shadow-sm dark:bg-gray-950 dark:text-gray-50"
                : "hover:bg-white/50 hover:text-gray-950 dark:hover:bg-gray-800/50 dark:hover:text-gray-50",
            className
        )}
        {...props}
    />
))
TabNavigationLink.displayName = "TabNavigationLink"

export { TabNavigation, TabNavigationLink }
