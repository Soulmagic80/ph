"use client"
import { Button } from "@/components/ui/Button"
import { useParams, useRouter } from "next/navigation"
import React from "react"

export default function FeedbackInfo() {
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()
    const params = useParams()
    if (!params?.id) throw new Error("Portfolio ID is required")
    const portfolioId = params.id as string

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            router.push(`/feedback/${portfolioId}/pchips`)
        }, 600)
    }

    return (
        <main className="mx-auto p-4">
            <div
                className="motion-safe:animate-revealBottom"
                style={{ animationDuration: "500ms" }}
            >
                <h1 className="heading-page">
                    Help This Portfolio Shine with Feedback!
                </h1>
                <p className="mt-6 text-gray-700 sm:text-sm dark:text-gray-300">
                    Your feedback will go through four simple steps:
                    <br /><br />
                    1. What you love about this portfolio
                    <br />
                    2. What you think could be even better/improved
                    <br />
                    3. Share your ideas and suggestions
                    <br />
                    4. Add any additional comments
                    <br /><br />
                    This approach helps ensure your feedback is meaningful and actionable. This will only take 4 minutes.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="mt-6 flex justify-end">
                    <Button
                        className="disabled:bg-gray-200 disabled:text-gray-500"
                        type="submit"
                        disabled={loading}
                        aria-disabled={loading}
                        isLoading={loading}
                    >
                        {loading ? "Loading..." : "Start Feedback"}
                    </Button>
                </div>
            </form>
        </main>
    )
} 