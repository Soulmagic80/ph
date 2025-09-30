import { Button } from "@/components/ui/Button"
import { cx } from "@/lib/utils"
import { Table } from "@tanstack/react-table"
import {
    ChevronLeft,
    ChevronRight,
    ChevronsLeft,
    ChevronsRight,
} from "lucide-react"

interface PortfolioDataTablePaginationProps<TData> {
    table: Table<TData>
    pageSize: number
}

export function PortfolioDataTablePagination<TData>({
    table,
    pageSize,
}: PortfolioDataTablePaginationProps<TData>) {
    const paginationButtons = [
        {
            icon: ChevronsLeft,
            onClick: () => table.setPageIndex(0),
            disabled: !table.getCanPreviousPage(),
            srText: "First page",
            mobileView: "hidden sm:block",
        },
        {
            icon: ChevronLeft,
            onClick: () => table.previousPage(),
            disabled: !table.getCanPreviousPage(),
            srText: "Previous page",
            mobileView: "",
        },
        {
            icon: ChevronRight,
            onClick: () => table.nextPage(),
            disabled: !table.getCanNextPage(),
            srText: "Next page",
            mobileView: "",
        },
        {
            icon: ChevronsRight,
            onClick: () => table.setPageIndex(table.getPageCount() - 1),
            disabled: !table.getCanNextPage(),
            srText: "Last page",
            mobileView: "hidden sm:block",
        },
    ]

    const totalRows = table.getFilteredRowModel().rows.length
    const currentPage = table.getState().pagination.pageIndex
    const firstRowIndex = currentPage * pageSize + 1
    const lastRowIndex = Math.min(totalRows, firstRowIndex + pageSize - 1)

    return (
        <div className="flex items-center justify-between">
            <div className="text-sm tabular-nums text-gray-500">
                {table.getFilteredSelectedRowModel().rows.length} of {totalRows} row(s)
                selected.
            </div>
            <div className="flex items-center gap-x-6 lg:gap-x-8">
                <p className="hidden text-sm tabular-nums text-gray-500 sm:block">
                    Showing{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-50">
                        {totalRows > 0 ? firstRowIndex : 0}-{totalRows > 0 ? lastRowIndex : 0}
                    </span>{" "}
                    of{" "}
                    <span className="font-medium text-gray-900 dark:text-gray-50">
                        {totalRows}
                    </span>
                </p>
                <div className="flex items-center gap-x-1.5">
                    {paginationButtons.map((button, index) => (
                        <Button
                            key={index}
                            variant="ghost"
                            className={cx(button.mobileView, "p-1.5")}
                            onClick={() => {
                                button.onClick()
                                table.resetRowSelection()
                            }}
                            disabled={button.disabled}
                        >
                            <span className="sr-only">{button.srText}</span>
                            <button.icon className="size-4 shrink-0" aria-hidden="true" />
                        </Button>
                    ))}
                </div>
            </div>
        </div>
    )
}




