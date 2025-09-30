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

import { PortfolioDataTableFilterbar } from "./PortfolioDataTableFilterbar"
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

interface AdminPortfolio {
    id: string;
    title: string;
    description: string | null;
    status: string;
    created_at: string;
    updated_at: string;
    deleted_at: string | null;
    deleted_by: string | null;
    published: boolean;
    approved: boolean;
    images: string[];
    user: {
        id: string;
        username: string | null;
        full_name: string | null;
    };
    feedback_count?: number;
}

interface PortfolioDataTableProps {
    columns: ColumnDef<AdminPortfolio>[]
    data: AdminPortfolio[]
    onBulkAction?: (action: string, selectedIds: string[]) => void
}

export function PortfolioDataTable({
    columns,
    data,
    onBulkAction
}: PortfolioDataTableProps) {
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
                <PortfolioDataTableFilterbar
                    table={table}
                    selectedCount={selectedIds.length}
                    onBulkAction={handleBulkAction}
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
                                        onClick={() => row.toggleSelected(!row.getIsSelected())}
                                        className="group select-none hover:bg-gray-50 hover:dark:bg-gray-900 cursor-pointer"
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell
                                                key={cell.id}
                                                className={cx(
                                                    row.getIsSelected()
                                                        ? "bg-gray-50 dark:bg-gray-900"
                                                        : "",
                                                    "relative whitespace-nowrap py-3 text-gray-600 first:w-10 dark:text-gray-400",
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
                                        No portfolios found.
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
