"use client";

import { CheckCircle } from "lucide-react";

export default function AdminEmptyState() {
    return (
        <div className="text-center py-12">
            <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                All caught up!
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
                No portfolios pending approval.
            </p>
        </div>
    );
}
