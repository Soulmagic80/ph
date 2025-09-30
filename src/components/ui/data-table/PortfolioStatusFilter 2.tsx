"use client"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import {
    Popover,
    PopoverClose,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/Popover"
import { cx } from "@/lib/utils"
import { Column } from "@tanstack/react-table"
import { ChevronDown, Plus } from "lucide-react"
import React from "react"

const statusOptions = [
    { value: "pending", label: "Pending", variant: "warning" as const },
    { value: "approved", label: "Approved", variant: "default" as const },
    { value: "published", label: "Published", variant: "success" as const },
    { value: "declined", label: "Declined", variant: "error" as const },
    { value: "draft", label: "Draft", variant: "neutral" as const },
    { value: "deleted", label: "Deleted", variant: "error" as const },
]

interface PortfolioStatusFilterProps<TData, TValue> {
    column: Column<TData, TValue> | undefined
    title?: string
}

export function PortfolioStatusFilter<TData, TValue>({
    column,
    title = "Status",
}: PortfolioStatusFilterProps<TData, TValue>) {
    const columnFilters = column?.getFilterValue() as string[] | undefined
    const [selectedValues, setSelectedValues] = React.useState<string[]>(
        columnFilters || []
    )

    const selectedLabels = React.useMemo(() => {
        if (!selectedValues || selectedValues.length === 0) return undefined

        return selectedValues.map(value => {
            const option = statusOptions.find(opt => opt.value === value)
            return option?.label || value
        })
    }, [selectedValues])

    const getDisplayLabel = () => {
        if (!selectedLabels || selectedLabels.length === 0) return title

        if (selectedLabels.length === 1) {
            return selectedLabels[0]
        }

        if (selectedLabels.length <= 2) {
            return selectedLabels.join(", ")
        }

        return `${selectedLabels[0]} and ${selectedLabels.length - 1} more`
    }

    React.useEffect(() => {
        setSelectedValues(columnFilters || [])
    }, [columnFilters])

    const handleApply = () => {
        column?.setFilterValue(selectedValues.length > 0 ? selectedValues : undefined)
    }

    const handleReset = () => {
        setSelectedValues([])
        column?.setFilterValue(undefined)
    }

    const hasActiveFilters = selectedValues && selectedValues.length > 0

    return (
        <Popover>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className={cx(
                        "flex items-center gap-x-1.5 whitespace-nowrap rounded-md border px-2 py-1.5 text-gray-600 hover:bg-gray-50 text-xs dark:border-gray-700 dark:text-gray-400 hover:dark:bg-gray-900",
                        hasActiveFilters
                            ? "border-gray-300 dark:border-gray-600"
                            : "border-dashed border-gray-300 dark:border-gray-700",
                        "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-950"
                    )}
                >
                    <span
                        aria-hidden="true"
                        onClick={(e) => {
                            if (hasActiveFilters) {
                                e.stopPropagation()
                                handleReset()
                            }
                        }}
                    >
                        <Plus
                            className={cx(
                                "size-4 shrink-0 transition",
                                hasActiveFilters && "rotate-45 hover:text-gray-700 dark:hover:text-gray-300"
                            )}
                            aria-hidden="true"
                        />
                    </span>

                    <span className="text-left">{getDisplayLabel()}</span>

                    {hasActiveFilters && (
                        <span
                            className="h-4 w-px bg-gray-300 dark:bg-gray-700"
                            aria-hidden="true"
                        />
                    )}

                    <ChevronDown
                        className="size-4 shrink-0 text-gray-500"
                        aria-hidden="true"
                    />
                </button>
            </PopoverTrigger>

            <PopoverContent
                align="start"
                sideOffset={7}
                className="w-72"
            >
                <div className="space-y-3">
                    <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                            Filter by {title}
                        </h4>

                        <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                            {statusOptions.map((option) => (
                                <div key={option.value} className="flex items-center gap-2">
                                    <Checkbox
                                        id={option.value}
                                        checked={selectedValues.includes(option.value)}
                                        onCheckedChange={(checked) => {
                                            setSelectedValues((prev) => {
                                                if (checked) {
                                                    return [...prev, option.value]
                                                } else {
                                                    return prev.filter((value) => value !== option.value)
                                                }
                                            })
                                        }}
                                    />
                                    <label
                                        htmlFor={option.value}
                                        className="text-sm flex items-center gap-2 cursor-pointer"
                                    >
                                        <Badge variant={option.variant} className="text-xs">
                                            {option.label}
                                        </Badge>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex gap-2">
                        <PopoverClose asChild>
                            <Button
                                onClick={handleApply}
                                className="flex-1 text-xs py-1.5"
                            >
                                Apply
                            </Button>
                        </PopoverClose>

                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                onClick={handleReset}
                                className="flex-1 text-xs py-1.5"
                            >
                                Reset
                            </Button>
                        )}
                    </div>
                </div>
            </PopoverContent>
        </Popover>
    )
}
