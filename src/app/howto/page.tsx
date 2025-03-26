"use client"

import { Card } from "@/components/ui/card"

export default function HowtoPage() {
    return (
        <div className="container mx-auto py-8">
            <h1 className="text-3xl font-bold mb-4">How to Use</h1>
            <p className="text-gray-600 mb-8">
                Learn how to use our platform effectively with these guides and tutorials.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Getting Started</h2>
                    <p className="text-gray-600">
                        Learn the basics of our platform and how to get started with your first project.
                    </p>
                </Card>

                <Card className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Best Practices</h2>
                    <p className="text-gray-600">
                        Discover tips and tricks to make the most of our platform&apos;s features.
                    </p>
                </Card>
            </div>
        </div>
    )
} 