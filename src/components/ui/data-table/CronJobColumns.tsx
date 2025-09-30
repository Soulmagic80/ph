"use client"

import { Button } from "@/components/ui/Button"
import { Checkbox } from "@/components/ui/Checkbox"
import { ColumnDef, createColumnHelper } from "@tanstack/react-table"
import { Calendar, Check, Send, Undo2 } from "lucide-react"
import { PortfolioDataTableColumnHeader } from "./PortfolioDataTableColumnHeader"

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

interface CronJobColumnsProps {
    onPublishNow?: (id: string) => void;
    onUnapprove?: (id: string) => void;
    processingId?: string | null;
    adminSettings?: {
        weekly_publish_limit: number;
        publish_strategy: 'oldest_first' | 'newest_first' | 'manual';
    } | null;
    portfolios?: ApprovedPortfolio[];
}

const columnHelper = createColumnHelper<ApprovedPortfolio>()

export const createCronJobColumns = ({
    onPublishNow,
    onUnapprove,
    processingId,
    adminSettings,
    portfolios = []
}: CronJobColumnsProps = {}): ColumnDef<ApprovedPortfolio>[] => {

    // Calculate which portfolios are in the next batch
    const getNextBatchPortfolios = () => {
        if (portfolios.length === 0) return [];

        // Use default settings if none provided
        const limit = adminSettings?.weekly_publish_limit || 5;
        const strategy = adminSettings?.publish_strategy || 'oldest_first';

        let sortedPortfolios = [...portfolios];
        if (strategy === 'newest_first') {
            sortedPortfolios.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        } else {
            // oldest_first (default)
            sortedPortfolios.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
        }

        return sortedPortfolios.slice(0, Math.min(limit, portfolios.length));
    };

    const nextBatchPortfolios = getNextBatchPortfolios();
    const nextBatchIds = new Set(nextBatchPortfolios.map(p => p.id));

    // Calculate scheduled publish dates
    const getScheduledPublishDate = (portfolio: ApprovedPortfolio) => {
        // Use default settings if none provided
        const limit = adminSettings?.weekly_publish_limit || 5;
        const strategy = adminSettings?.publish_strategy || 'oldest_first';

        let sortedPortfolios = [...portfolios];
        if (strategy === 'newest_first') {
            sortedPortfolios.sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime());
        } else {
            sortedPortfolios.sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());
        }

        const portfolioIndex = sortedPortfolios.findIndex(p => p.id === portfolio.id);
        if (portfolioIndex === -1) return null;

        const batchNumber = Math.floor(portfolioIndex / limit);
        const nextSunday = new Date();
        nextSunday.setDate(nextSunday.getDate() + (7 - nextSunday.getDay()));
        nextSunday.setHours(10, 0, 0, 0); // 10 AM on Sunday

        // Add weeks for later batches
        nextSunday.setDate(nextSunday.getDate() + (batchNumber * 7));

        return nextSunday;
    };

    return [
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
                    <div className="text-sm font-medium text-gray-900 dark:text-white py-2">
                        {portfolio.title}
                    </div>
                )
            },
        }),

        columnHelper.accessor("user" as any, {
            header: ({ column }) => (
                <PortfolioDataTableColumnHeader column={column} title="User" />
            ),
            enableSorting: true,
            enableHiding: false,
            meta: {
                className: "text-left",
                displayName: "User",
            },
            cell: ({ row }) => {
                const user = row.original.user
                return (
                    <div className="text-sm text-gray-900 dark:text-white py-2">
                        {user.full_name || user.username || 'Unknown'}
                    </div>
                )
            },
        }),

        columnHelper.accessor("updated_at" as any, {
            header: ({ column }) => (
                <PortfolioDataTableColumnHeader column={column} title="Approved" />
            ),
            enableSorting: true,
            enableHiding: false,
            meta: {
                className: "text-left",
                displayName: "Approved",
            },
            cell: ({ row }) => {
                const portfolio = row.original
                const date = new Date(portfolio.updated_at)
                return (
                    <div className="text-sm text-gray-500 dark:text-gray-400 py-2">
                        <div>{date.toLocaleDateString('de-DE')}</div>
                        <div className="text-xs text-gray-400">
                            {date.toLocaleTimeString('de-DE', {
                                hour: '2-digit',
                                minute: '2-digit',
                                second: '2-digit'
                            })}
                        </div>
                    </div>
                )
            },
        }),

        columnHelper.display({
            id: "next_publish",
            header: ({ column }) => (
                <PortfolioDataTableColumnHeader column={column} title="Next Publish" />
            ),
            enableSorting: false,
            enableHiding: false,
            meta: {
                className: "text-center",
                displayName: "Next Publish",
            },
            cell: ({ row }) => {
                const portfolio = row.original;
                const isInNextBatch = nextBatchIds.has(portfolio.id);
                const isCronJobEnabled = adminSettings?.publish_strategy !== 'manual';

                return (
                    <div className="flex items-center justify-center py-2">
                        {!isCronJobEnabled ? (
                            <span className="text-xs text-gray-500 font-medium">Manual</span>
                        ) : isInNextBatch ? (
                            <div className="flex items-center gap-1">
                                <Check className="w-4 h-4 text-green-600" />
                                <span className="text-xs text-green-600 font-medium">Next</span>
                            </div>
                        ) : (
                            <span className="text-xs text-gray-400">Later</span>
                        )}
                    </div>
                )
            },
        }),

        columnHelper.display({
            id: "scheduled_for",
            header: ({ column }) => (
                <PortfolioDataTableColumnHeader column={column} title="Scheduled For" />
            ),
            enableSorting: false,
            enableHiding: false,
            meta: {
                className: "text-left",
                displayName: "Scheduled For",
            },
            cell: ({ row }) => {
                const portfolio = row.original;
                const scheduledDate = getScheduledPublishDate(portfolio);
                const isCronJobEnabled = adminSettings?.publish_strategy !== 'manual';

                return (
                    <div className="flex items-center gap-2 py-2">
                        <Calendar className="w-4 h-4 text-blue-500" />
                        <div className="text-sm text-gray-900 dark:text-white">
                            {!isCronJobEnabled ? (
                                <>
                                    <div>No date</div>
                                    <div className="text-xs text-gray-500">Manual</div>
                                </>
                            ) : (
                                <>
                                    <div>{scheduledDate?.toLocaleDateString('de-DE') || 'TBD'}</div>
                                    <div className="text-xs text-gray-500">
                                        {scheduledDate?.toLocaleTimeString('de-DE', {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        }) || '10:00'}
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                )
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

                return (
                    <div className="flex justify-end gap-2 py-2">
                        <Button
                            onClick={() => onUnapprove?.(portfolio.id)}
                            disabled={isProcessing}
                            variant="secondary"
                            className="flex items-center gap-2 text-sm px-3 py-2"
                            title="Back to pending"
                        >
                            <Undo2 className="w-4 h-4" />
                        </Button>
                        <Button
                            onClick={() => onPublishNow?.(portfolio.id)}
                            disabled={isProcessing}
                            variant="primary"
                            className="flex items-center gap-2 text-sm px-3 py-2"
                        >
                            <Send className="w-4 h-4" />
                            {isProcessing ? 'Publishing...' : 'Publish Now'}
                        </Button>
                    </div>
                )
            },
        }),
    ]
}
