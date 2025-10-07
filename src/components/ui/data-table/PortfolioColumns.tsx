"use client"

import { Badge } from "@/components/ui/Badge"
import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { ArrowDown, CircleCheck, CircleX, Eye, RotateCcw, Trash2 } from "lucide-react"
import { PortfolioDataTableColumnHeader } from "./PortfolioDataTableColumnHeader"

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
    is_visible: boolean;
    images: string[];
    user: {
        id: string;
        username: string | null;
        full_name: string | null;
    };
    feedback_count?: number;
}

export interface PortfolioColumnsProps {
    onApprove?: (id: string) => void;
    onDecline?: (id: string) => void;
    onDelete?: (id: string) => void;
    onRestore?: (id: string) => void;
    onUnpublish?: (id: string) => void;
    processingId?: string | null;
}

const columnHelper = createColumnHelper<AdminPortfolio>()

export const createPortfolioColumns = ({
    onApprove,
    onDecline,
    onDelete,
    onRestore,
    onUnpublish,
    processingId
}: PortfolioColumnsProps = {}): ColumnDef<AdminPortfolio>[] => [
        columnHelper.display({
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected()
                            ? true
                            : table.getIsSomeRowsSelected()
                                ? "indeterminate"
                                : false
                    }
                    onCheckedChange={() => table.toggleAllPageRowsSelected()}
                    className="translate-y-0.5"
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={() => row.toggleSelected()}
                    className="translate-y-0.5"
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
            meta: {
                displayName: "Select",
            },
        }),

        columnHelper.accessor("title" as any, {
            header: ({ column }) => (
                <PortfolioDataTableColumnHeader column={column} title="Portfolio" />
            ),
            enableSorting: true,
            enableHiding: false,
            meta: {
                className: "text-left",
                displayName: "Portfolio",
            },
            cell: ({ row }) => {
                const portfolio = row.original
                return (
                    <div className="text-sm text-gray-900 dark:text-white py-2">
                        {portfolio.title}
                    </div>
                )
            },
        }),

        columnHelper.accessor("user" as any, {
            header: ({ column }) => (
                <PortfolioDataTableColumnHeader column={column} title="User" />
            ),
            enableSorting: false,
            meta: {
                className: "text-left",
                displayName: "User",
            },
            cell: ({ row }) => {
                const user = row.original.user
                return (
                    <div className="text-sm text-gray-900 dark:text-white">
                        {user.full_name || user.username || 'Unknown'}
                    </div>
                )
            },
        }),

        columnHelper.accessor("images" as any, {
            header: ({ column }) => (
                <PortfolioDataTableColumnHeader column={column} title="Images" />
            ),
            enableSorting: true,
            meta: {
                className: "text-center",
                displayName: "Images",
            },
            cell: ({ row }) => {
                const imageCount = row.original.images.length
                return (
                    <div className="text-sm text-center text-gray-600 dark:text-gray-400">
                        {imageCount}
                    </div>
                )
            },
        }),

        columnHelper.accessor("feedback_count" as any, {
            header: ({ column }) => (
                <PortfolioDataTableColumnHeader column={column} title="Feedback" />
            ),
            enableSorting: true,
            meta: {
                className: "text-center",
                displayName: "Feedback",
            },
            cell: ({ row }) => {
                const feedbackCount = row.original.feedback_count || 0
                const hasGoodFeedback = feedbackCount >= 5

                return (
                    <div className="flex items-center justify-center gap-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                            {feedbackCount}
                        </span>
                        {hasGoodFeedback ? (
                            <CircleCheck className="w-4 h-4 text-green-600" />
                        ) : (
                            <CircleX className="w-4 h-4 text-red-600" />
                        )}
                    </div>
                )
            },
        }),

        columnHelper.accessor("status" as any, {
            header: ({ column }) => (
                <PortfolioDataTableColumnHeader column={column} title="Status" />
            ),
            enableSorting: true,
            meta: {
                className: "text-left",
                displayName: "Status",
            },
            cell: ({ row }) => {
                const portfolio = row.original

                if (portfolio.deleted_at) {
                    return <Badge variant="error">Deleted</Badge>;
                }

                if (portfolio.status === 'draft') {
                    return <Badge variant="neutral">Draft</Badge>;
                }
                if (portfolio.status === 'pending') {
                    return <Badge variant="warning">Pending</Badge>;
                }
                if (portfolio.status === 'declined') {
                    return <Badge variant="error">Declined</Badge>;
                }
                if (portfolio.approved && portfolio.published && portfolio.is_visible) {
                    return <Badge variant="success">Published</Badge>;
                }
                if (portfolio.approved && portfolio.published && !portfolio.is_visible) {
                    return <Badge variant="warning">Offline</Badge>;
                }
                if (portfolio.approved && !portfolio.published) {
                    return <Badge variant="default">Approved</Badge>;
                }
                return <Badge variant="neutral">Unknown</Badge>;
            },
            filterFn: (row, _columnId, filterValue: string[]) => {
                const portfolio = row.original

                if (!filterValue || filterValue.length === 0) return true

                // Map filter values to actual status logic
                const statusChecks = filterValue.map(value => {
                    switch (value) {
                        case 'deleted':
                            return !!portfolio.deleted_at
                        case 'draft':
                            return portfolio.status === 'draft' && !portfolio.deleted_at
                        case 'pending':
                            return portfolio.status === 'pending' && !portfolio.deleted_at
                        case 'declined':
                            return portfolio.status === 'declined' && !portfolio.deleted_at
                        case 'approved':
                            return portfolio.approved && !portfolio.published && !portfolio.deleted_at
                        case 'published':
                            return portfolio.approved && portfolio.published && !portfolio.deleted_at
                        default:
                            return false
                    }
                })

                return statusChecks.some(check => check)
            },
        }),

        columnHelper.accessor("created_at" as any, {
            header: ({ column }) => (
                <PortfolioDataTableColumnHeader column={column} title="Created" />
            ),
            enableSorting: true,
            meta: {
                className: "tabular-nums text-right",
                displayName: "Created",
            },
            cell: ({ getValue }) => {
                const date = new Date(getValue() as string)
                return date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                })
            },
        }),

        columnHelper.display({
            id: "actions",
            header: "Actions",
            enableSorting: false,
            enableHiding: false,
            meta: {
                className: "text-right",
                displayName: "Actions",
            },
            cell: ({ row }) => {
                const portfolio = row.original
                const isProcessing = processingId === portfolio.id
                const isDeleted = !!portfolio.deleted_at
                const isPending = portfolio.status === 'pending' && !isDeleted
                const isApproved = portfolio.status === 'approved' && portfolio.published && !isDeleted

                return (
                    <div className="flex items-center justify-end gap-1">
                        {/* View - Always available */}
                        <Button
                            variant="ghost"
                            onClick={(e) => {
                                e.stopPropagation()
                                window.open(`/${portfolio.id}`, '_blank')
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1"
                            title="View Portfolio"
                        >
                            <Eye className="w-4 h-4" />
                        </Button>

                        {/* Approve - Only for pending portfolios */}
                        <Button
                            variant="ghost"
                            onClick={(e) => {
                                e.stopPropagation()
                                onApprove?.(portfolio.id)
                            }}
                            disabled={isProcessing || !isPending}
                            className={`p-1 ${isPending
                                    ? "text-green-600 hover:text-green-900"
                                    : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                }`}
                            title={isPending ? "Approve Portfolio" : "Only pending portfolios can be approved"}
                        >
                            <CircleCheck className="w-4 h-4" />
                        </Button>

                        {/* Decline - Only for pending portfolios */}
                        <Button
                            variant="ghost"
                            onClick={(e) => {
                                e.stopPropagation()
                                onDecline?.(portfolio.id)
                            }}
                            disabled={isProcessing || !isPending}
                            className={`p-1 ${isPending
                                    ? "text-orange-600 hover:text-orange-900"
                                    : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                }`}
                            title={isPending ? "Decline Portfolio" : "Only pending portfolios can be declined"}
                        >
                            <CircleX className="w-4 h-4" />
                        </Button>

                        {/* Unpublish - Only for approved/published portfolios */}
                        <Button
                            variant="ghost"
                            onClick={(e) => {
                                e.stopPropagation()
                                onUnpublish?.(portfolio.id)
                            }}
                            disabled={isProcessing || !isApproved}
                            className={`p-1 ${isApproved
                                    ? "text-purple-600 hover:text-purple-900"
                                    : "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                                }`}
                            title={isApproved ? "Unpublish Portfolio" : "Only published portfolios can be unpublished"}
                        >
                            <ArrowDown className="w-4 h-4" />
                        </Button>

                        {/* Delete/Restore */}
                        {isDeleted ? (
                            <Button
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onRestore?.(portfolio.id)
                                }}
                                disabled={isProcessing}
                                className="text-green-600 hover:text-green-900 p-1"
                                title="Restore Portfolio"
                            >
                                <RotateCcw className="w-4 h-4" />
                            </Button>
                        ) : (
                            <Button
                                variant="ghost"
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onDelete?.(portfolio.id)
                                }}
                                disabled={isProcessing}
                                className="text-red-600 hover:text-red-900 p-1"
                                title="Delete Portfolio"
                            >
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        )}
                    </div>
                )
            },
        }),
    ]
