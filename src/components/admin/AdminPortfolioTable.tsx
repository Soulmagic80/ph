"use client";

import { Table, TableBody, TableHead, TableHeaderCell, TableRow } from "@/components/ui/Table";
import { ArrowUpDown } from "lucide-react";
import AdminPortfolioRow from "./AdminPortfolioRow";

interface PendingPortfolio {
    id: string;
    title: string;
    description: string | null;
    status: 'pending' | 'approved' | 'declined';
    created_at: string;
    updated_at: string;
    user: {
        id: string;
        username: string | null;
        full_name: string | null;
    };
    images: string[];
    feedback_count?: number;
}

interface AdminPortfolioTableProps {
    portfolios: PendingPortfolio[];
    processingId: string | null;
    onProcessingChange: (id: string | null) => void;
    onPortfolioUpdate: () => void;
    onSortByDate: () => void;
}

export default function AdminPortfolioTable({
    portfolios,
    processingId,
    onProcessingChange,
    onPortfolioUpdate,
    onSortByDate
}: AdminPortfolioTableProps) {

    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
            <div className="overflow-x-auto">
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableHeaderCell className="min-w-[200px]">Portfolio</TableHeaderCell>
                            <TableHeaderCell className="min-w-[120px] hidden sm:table-cell">User</TableHeaderCell>
                            <TableHeaderCell
                                className="cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 min-w-[120px]"
                                onClick={onSortByDate}
                            >
                                <div className="flex items-center gap-2">
                                    Submitted
                                    <ArrowUpDown size={14} className="text-gray-400" />
                                </div>
                            </TableHeaderCell>
                            <TableHeaderCell className="min-w-[100px] hidden md:table-cell">Feedbacks</TableHeaderCell>
                            <TableHeaderCell className="min-w-[100px]">Status</TableHeaderCell>
                            <TableHeaderCell className="min-w-[200px]">Actions</TableHeaderCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {portfolios.map(portfolio => (
                            <AdminPortfolioRow
                                key={portfolio.id}
                                portfolio={portfolio}
                                isProcessing={processingId === portfolio.id}
                                onProcessingChange={onProcessingChange}
                                onPortfolioUpdate={onPortfolioUpdate}
                            />
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
