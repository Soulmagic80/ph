"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeaderCell,
    TableRow,
} from "@/components/ui/Table"
import { cx } from "@/lib/utils"
import * as React from "react"

import { CronJobFilterbar } from "./CronJobFilterbar"
import { PortfolioDataTablePagination } from "./PortfolioDataTablePagination"

import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table"

interface ApprovedPortfolio {
    id: string;
    title: string;
    description: string | null;
    created_at: string;
    updated_at: string;
    approved: boolean;
    published: boolean;
    published_at: string | null;
    manual_publish: boolean | null;
    user: {
        id: string;
        username: string | null;
        full_name: string | null;
    };
}

interface CronJobDataTableProps {
    columns: ColumnDef<ApprovedPortfolio>[]
    data: ApprovedPortfolio[]
    onBulkAction?: (action: string, selectedIds: string[]) => void
    weeklyLimit?: number
    onToggleSettings?: () => void
    onTestCron?: () => void
    onRefreshRankings?: () => void
}

export function CronJobDataTable({
    columns,
    data,
    onBulkAction,
    weeklyLimit = 5,
    onToggleSettings,
    onTestCron,
    onRefreshRankings
}: CronJobDataTableProps) {
    const pageSize = 20
    const [rowSelection, setRowSelection] = React.useState({})

    const table = useReactTable({
        data,
        columns,
        state: {
            rowSelection,
        },
        initialState: {
            pagination: {
                pageIndex: 0,
                pageSize: pageSize,
            },
        },
        enableRowSelection: true,
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onRowSelectionChange: setRowSelection,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })

    // Handle bulk actions
    const selectedRows = table.getFilteredSelectedRowModel().rows
    const selectedIds = selectedRows.map(row => row.original.id)

    const handleBulkAction = (action: string) => {
        if (onBulkAction && selectedIds.length > 0) {
            onBulkAction(action, selectedIds)
            table.resetRowSelection()
        }
    }

    return (
        <>
            <div className="space-y-6">
                <CronJobFilterbar
                    table={table}
                    selectedCount={selectedIds.length}
                    onBulkAction={handleBulkAction}
                    weeklyLimit={weeklyLimit}
                    onToggleSettings={onToggleSettings}
                    onTestCron={onTestCron}
                    onRefreshRankings={onRefreshRankings}
                />
                <div className="relative overflow-hidden overflow-x-auto">
                    <Table>
                        <TableHead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow
                                    key={headerGroup.id}
                                    className="border-y border-gray-200 dark:border-gray-800"
                                >
                                    {headerGroup.headers.map((header) => (
                                        <TableHeaderCell
                                            key={header.id}
                                            className={cx(
                                                "whitespace-nowrap py-1 text-sm sm:text-xs",
                                                (header.column.columnDef.meta as any)?.className,
                                            )}
                                        >
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext(),
                                            )}
                                        </TableHeaderCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>
                        <TableBody>
                            {table.getRowModel().rows?.length ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                        className="border-b border-gray-100 hover:bg-gray-50 dark:border-gray-800 dark:hover:bg-gray-800/50"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className={cx(
                                                    "py-2 text-sm",
                                                    (cell.column.columnDef.meta as any)?.className,
                                                )}
                                            >
                                                {flexRender(
                                                    cell.column.columnDef.cell,
                                                    cell.getContext(),
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell
                                        colSpan={columns.length}
                                        className="h-24 text-center"
                                    >
                                        No approved portfolios waiting for publication.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
                <PortfolioDataTablePagination table={table} pageSize={pageSize} />
            </div>
        </>
    )
}
