"use client"

import { Card, Text, Title } from "@tremor/react"

export default function HowtoPage() {
    return (
        <div className="container mx-auto py-8">
            <Title>How to Use</Title>
            <Text className="mb-8">
                Learn how to use our platform effectively with these guides and tutorials.
            </Text>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <Title>Getting Started</Title>
                    <Text>
                        Learn the basics of our platform and how to get started with your first project.
                    </Text>
                </Card>

                <Card>
                    <Title>Best Practices</Title>
                    <Text>
                        Discover tips and tricks to make the most of our platform&apos;s features.
                    </Text>
                </Card>
            </div>
        </div>
    )
} 