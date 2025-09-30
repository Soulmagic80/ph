"use client";

import { Button } from "@/components/ui/Button";
import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import * as React from "react";

export default function ThemeSwitch() {
    const [mounted, setMounted] = React.useState(false);
    const { theme, setTheme } = useTheme();

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="flex space-x-1">
                {/* Skeleton buttons while loading */}
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
                <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-md animate-pulse" />
            </div>
        );
    }

    const themes = [
        { name: "light", icon: Sun, label: "Light mode" },
        { name: "dark", icon: Moon, label: "Dark mode" },
        { name: "system", icon: Monitor, label: "System mode" },
    ];

    return (
        <div className="flex space-x-1">
            {themes.map(({ name, icon: Icon, label }) => (
                <Button
                    key={name}
                    variant="ghost"
                    onClick={() => setTheme(name)}
                    className={`p-2 h-8 w-8 ${theme === name
                        ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-100"
                        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
                        }`}
                    aria-label={label}
                >
                    <Icon className="h-4 w-4" />
                </Button>
            ))}
        </div>
    );
}