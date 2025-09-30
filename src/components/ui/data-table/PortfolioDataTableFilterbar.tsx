"use client"

import { Button } from "@/components/ui/Button"
import { Table } from "@tanstack/react-table"
import { ArrowDown, CircleCheck, CircleX, RotateCcw, Trash2 } from "lucide-react"
import { PortfolioStatusFilter } from "./PortfolioStatusFilter"

interface PortfolioDataTableFilterbarProps<TData> {
    table: Table<TData>
    selectedCount: number
    onBulkAction?: (action: string) => void
}

export function PortfolioDataTableFilterbar<TData>({
    table,
    selectedCount,
    onBulkAction
}: PortfolioDataTableFilterbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    const clearFilters = () => {
        table.resetColumnFilters()
    }

    return (
        <div className="flex flex-wrap items-center justify-between gap-2 sm:gap-x-6">
            <div className="flex w-full flex-col gap-2 sm:w-fit sm:flex-row sm:items-center">
                {/* Status Filter */}
                <PortfolioStatusFilter
                    column={table.getColumn("status")}
                    title="Status"
                />

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={clearFilters}
                        className="border border-gray-200 px-2 text-xs text-gray-500 hover:text-gray-700 sm:border-none sm:py-1 dark:border-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                    >
                        Clear filters
                    </Button>
                )}
            </div>

            {/* Bulk Actions */}
            {selectedCount > 0 && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                        {selectedCount} selected
                    </span>
                    <div className="flex gap-1">
                        <Button
                            variant="ghost"
                            onClick={() => onBulkAction?.('approve')}
                            className="text-green-600 hover:text-green-900 p-1.5"
                            title="Approve selected"
                        >
                            <CircleCheck className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => onBulkAction?.('decline')}
                            className="text-orange-600 hover:text-orange-900 p-1.5"
                            title="Decline selected"
                        >
                            <CircleX className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => onBulkAction?.('unpublish')}
                            className="text-purple-600 hover:text-purple-900 p-1.5"
                            title="Unpublish selected"
                        >
                            <ArrowDown className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => onBulkAction?.('delete')}
                            className="text-red-600 hover:text-red-900 p-1.5"
                            title="Delete selected"
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => onBulkAction?.('restore')}
                            className="text-blue-600 hover:text-blue-900 p-1.5"
                            title="Restore selected"
                        >
                            <RotateCcw className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
