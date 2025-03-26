"use client"

import { Card } from "@/components/ui/card"

export default function HowtoPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                    How to use PortfolioHunt
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Learn how to create and manage your portfolio on PortfolioHunt.
                </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                        Getting Started
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Create your first portfolio and start showcasing your work.
                    </p>
                </Card>

                <Card className="p-6">
                    <h2 className="text-lg font-medium text-gray-900 dark:text-gray-50">
                        Best Practices
                    </h2>
                    <p className="mt-2 text-gray-600 dark:text-gray-400">
                        Learn how to create an effective portfolio that stands out.
                    </p>
                </Card>
            </div>
        </div>
    )
} 