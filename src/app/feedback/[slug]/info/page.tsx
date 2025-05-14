"use client"
import { Button } from "@/components/Button"
import {
    RadioCardGroup,
    RadioCardIndicator,
    RadioCardItem,
} from "@/components/RadioCardGroup"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import React, { useState } from "react"

const relationshipTypes = [
    { value: "colleague", label: "Current/Former Colleague" },
    { value: "manager", label: "Current/Former Manager" },
    { value: "client", label: "Client" },
    { value: "vendor", label: "Vendor/Partner" },
    { value: "other", label: "Other Professional Relationship" },
]

export default function FeedbackInfo() {
    const [selectedRelationType, setSelectedRelationType] = useState("")
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()
    const params = useParams()
    const portfolioSlug = params.slug as string

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            console.log("Form submitted with relationship type:", selectedRelationType)
            router.push(`/feedback/${portfolioSlug}/chips`)
        }, 600)
    }

    return (
        <main className="mx-auto p-4">
            <div
                className="motion-safe:animate-revealBottom"
                style={{ animationDuration: "500ms" }}
            >
                <h1 className="text-2xl font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
                    What is your relationship to this portfolio owner?
                </h1>
                <p className="mt-6 text-gray-700 sm:text-sm dark:text-gray-300">
                    This helps provide context for your feedback and ensures meaningful responses.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
                <fieldset>
                    <legend className="sr-only">Select your relationship type</legend>
                    <RadioCardGroup
                        value={selectedRelationType}
                        onValueChange={(value) => setSelectedRelationType(value)}
                        required
                        aria-label="Relationship type"
                    >
                        {relationshipTypes.map((type, index) => (
                            <div
                                className="motion-safe:animate-revealBottom"
                                key={type.value}
                                style={{
                                    animationDuration: "600ms",
                                    animationDelay: `${100 + index * 50}ms`,
                                    animationFillMode: "backwards",
                                }}
                            >
                                <RadioCardItem
                                    className="active:scale-[99%] dark:bg-gray-925"
                                    key={type.value}
                                    value={type.value}
                                    style={{
                                        animationDuration: "600ms",
                                        animationDelay: `${100 + index * 50}ms`,
                                        animationFillMode: "backwards",
                                    }}
                                >
                                    <div className="flex items-center gap-2.5">
                                        <RadioCardIndicator />
                                        <span className="block sm:text-sm">{type.label}</span>
                                    </div>
                                </RadioCardItem>
                            </div>
                        ))}
                    </RadioCardGroup>
                </fieldset>
                <div className="mt-6 flex justify-between">
                    <Button type="button" variant="ghost" asChild>
                        <Link href={`/portfolios/${portfolioSlug}`}>Cancel</Link>
                    </Button>
                    <Button
                        className="disabled:bg-gray-200 disabled:text-gray-500"
                        type="submit"
                        disabled={!selectedRelationType || loading}
                        aria-disabled={!selectedRelationType || loading}
                        isLoading={loading}
                    >
                        {loading ? "Submitting..." : "Continue"}
                    </Button>
                </div>
            </form>
        </main>
    )
} 