"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TableCell, TableRow } from "@/components/ui/Table";
import { getPortfolioImageUrl } from "@/lib/imageUtils";
import { Calendar, CheckCircle, Eye, User } from "lucide-react";
import Image from "next/image";
import AdminActions from "./AdminActions";

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

interface AdminPortfolioRowProps {
    portfolio: PendingPortfolio;
    isProcessing: boolean;
    onProcessingChange: (id: string | null) => void;
    onPortfolioUpdate: () => void;
}

export default function AdminPortfolioRow({
    portfolio,
    isProcessing,
    onProcessingChange,
    onPortfolioUpdate
}: AdminPortfolioRowProps) {

    const handlePreview = () => {
        window.open(`/${portfolio.id}`, '_blank');
    };

    // Helper function for conditional image src
    const getImageSrc = (imageUrl: string) => {
        return getPortfolioImageUrl(portfolio.id, imageUrl);
    };

    return (
        <TableRow className="hover:bg-gray-50 dark:hover:bg-gray-900/50">
            <TableCell>
                <div className="space-y-2">
                    <div className="font-medium text-gray-900 dark:text-gray-50">
                        {portfolio.title}
                    </div>
                    {portfolio.description && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
                            {portfolio.description}
                        </p>
                    )}
                    {portfolio.images && portfolio.images.length > 0 && (
                        <div className="flex gap-2">
                            {portfolio.images.slice(0, 3).map((imageUrl, index) => (
                                <div key={index} className="relative w-12 h-8 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
                                    <Image
                                        src={getImageSrc(imageUrl)}
                                        alt={`Portfolio image ${index + 1}`}
                                        fill
                                        className="object-cover"
                                        sizes="48px"
                                    />
                                </div>
                            ))}
                            {portfolio.images.length > 3 && (
                                <div className="w-12 h-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                    <span className="text-xs text-gray-500">+{portfolio.images.length - 3}</span>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </TableCell>

            <TableCell className="hidden sm:table-cell">
                <div className="flex items-center gap-2">
                    <User size={14} className="text-gray-400" />
                    <span className="text-sm">
                        {portfolio.user.full_name || portfolio.user.username || 'Anonymous'}
                    </span>
                </div>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <Calendar size={14} className="text-gray-400" />
                    <span className="text-sm">
                        {new Date(portfolio.created_at).toLocaleDateString()}
                    </span>
                </div>
            </TableCell>

            <TableCell className="hidden md:table-cell">
                <div className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-green-500" />
                    <span className="text-sm font-medium">
                        {portfolio.feedback_count || 0}
                    </span>
                </div>
            </TableCell>

            <TableCell>
                <Badge variant="warning">
                    {portfolio.status}
                </Badge>
            </TableCell>

            <TableCell>
                <div className="flex items-center gap-2">
                    <Button
                        onClick={handlePreview}
                        variant="secondary"
                        className="flex items-center gap-1"
                    >
                        <Eye size={14} />
                        Preview
                    </Button>
                    <AdminActions
                        portfolioId={portfolio.id}
                        isProcessing={isProcessing}
                        onProcessingChange={onProcessingChange}
                        onPortfolioUpdate={onPortfolioUpdate}
                    />
                </div>
            </TableCell>
        </TableRow>
    );
}
