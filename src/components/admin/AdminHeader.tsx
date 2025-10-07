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
                <h2 className="heading-section">
                    Portfolio Approvals
                </h2>
                <p className="text-small mt-1">
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
