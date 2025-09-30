"use client"

import { Button } from "@/components/ui/Button"
import { Table } from "@tanstack/react-table"
import { Play, Send, Settings } from "lucide-react"

interface CronJobFilterbarProps<TData> {
    table: Table<TData>
    selectedCount: number
    onBulkAction?: (action: string) => void
    weeklyLimit?: number
    onToggleSettings?: () => void
    onTestCron?: () => void
}

export function CronJobFilterbar<TData>({
    table,
    selectedCount,
    onBulkAction,
    weeklyLimit = 5,
    onToggleSettings,
    onTestCron
}: CronJobFilterbarProps<TData>) {

    const getNextSunday = () => {
        const now = new Date();
        const daysUntilSunday = 7 - now.getDay();
        const nextSunday = new Date(now);
        nextSunday.setDate(now.getDate() + (daysUntilSunday === 7 ? 7 : daysUntilSunday));
        nextSunday.setHours(0, 0, 0, 0);
        return nextSunday;
    };

    const totalRows = table.getFilteredRowModel().rows.length;

    return (
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-x-6">
            <div className="flex w-full flex-col gap-2 sm:w-fit sm:flex-row sm:items-center">
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Next automatic publish: <span className="font-medium">
                        {getNextSunday().toLocaleDateString('de-DE', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })} at 00:00
                    </span>
                    <span className="ml-2 text-xs bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-2 py-1 rounded">
                        {Math.min(weeklyLimit, totalRows)} of {totalRows} portfolios
                    </span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                {/* Settings Button */}
                <Button
                    variant="secondary"
                    onClick={onToggleSettings}
                    className="flex items-center gap-2 text-sm"
                    title="Publish Settings"
                >
                    <Settings className="w-4 h-4" />
                    Settings
                </Button>

                {/* Run CronJob Button */}
                <Button
                    variant="primary"
                    onClick={onTestCron}
                    className="flex items-center gap-2 text-sm bg-pink-500 hover:bg-pink-600 dark:bg-pink-500 dark:hover:bg-pink-600"
                    title="Run cron job manually"
                >
                    <Play className="w-4 h-4" />
                    Run CronJob
                </Button>


                {/* Bulk Actions */}
                {selectedCount > 0 && (
                    <>
                        <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                            {selectedCount} selected
                        </span>
                        <Button
                            variant="primary"
                            onClick={() => onBulkAction?.('publish')}
                            className="flex items-center gap-2 text-sm"
                        >
                            <Send className="w-4 h-4" />
                            Publish Now ({selectedCount})
                        </Button>
                    </>
                )}
            </div>
        </div>
    )
}
