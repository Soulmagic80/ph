"use client";

import { Button } from "@/components/ui/Button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { NavigationItem } from "@/config/navigation";
import { cx } from "@/lib/utils";
import { FileText, Link as LinkIcon, Wrench } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

interface ToolkitDropdownProps {
    item: NavigationItem;
}

// Icon mapping for toolkit items
const getToolkitIcon = (name: string) => {
    switch (name) {
        case "Tools":
            return Wrench;
        case "Templates":
            return FileText;
        case "Links":
            return LinkIcon;
        default:
            return Wrench;
    }
};

export function ToolkitDropdown({ item }: ToolkitDropdownProps) {
    const [open, setOpen] = React.useState(false);
    const router = useRouter();
    const Icon = item.icon;

    const handleNavigation = (href: string) => {
        setOpen(false);
        router.push(href);
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger asChild suppressHydrationWarning>
                <Button
                    variant="ghost"
                    onMouseEnter={() => setOpen(true)}
                    onMouseLeave={() => setOpen(false)}
                    className={cx(
                        "text-xs font-normal flex items-center gap-2",
                        "hover:bg-gray-200/50 data-[state=open]:bg-gray-200/50 hover:dark:bg-gray-800/50 data-[state=open]:dark:bg-gray-800/50"
                    )}
                    suppressHydrationWarning
                >
                    {Icon && <Icon className="w-4 h-4" />}
                    {item.name}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className={cx(
                    "z-50 min-w-[10rem] overflow-hidden rounded-md border bg-white p-1 text-gray-900 shadow-md dark:border-gray-800 dark:bg-gray-950 dark:text-gray-50",
                    "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
                )}
                sideOffset={5}
                onMouseEnter={() => setOpen(true)}
                onMouseLeave={() => setOpen(false)}
            >
                <DropdownMenuGroup>
                    {item.dropdown?.map((dropdownItem) => {
                        const ItemIcon = getToolkitIcon(dropdownItem.name);
                        return (
                            <DropdownMenuItem
                                key={dropdownItem.href}
                                onClick={() => handleNavigation(dropdownItem.href)}
                                className="gap-x-2.5"
                            >
                                <ItemIcon className="size-4 shrink-0" strokeWidth={1.5} aria-hidden="true" />
                                {dropdownItem.name}
                            </DropdownMenuItem>
                        );
                    })}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
