"use client";

import { Badge } from "@/components/ui/Badge";
import { Clock } from "lucide-react";

interface AdminHeaderProps {
    pendingCount: number;
}

export default function AdminHeader({ pendingCount }: AdminHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                    Portfolio Approvals
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Review and approve pending portfolio submissions
                </p>
            </div>
            <Badge variant="neutral" className="flex items-center gap-2">
                <Clock size={14} />
                {pendingCount} pending
            </Badge>
        </div>
    );
}
