"use client"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Label } from "@/components/Label"
import { Textarea } from "@/components/Textarea"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import React from "react"

export default function FeedbackComments() {
    const [comments, setComments] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()
    const params = useParams()
    const portfolioSlug = params.slug as string

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        // Hier würde normalerweise der API-Call zum Speichern des Feedbacks kommen
        setTimeout(() => {
            console.log("Feedback submitted:", { comments })
            router.push(`/portfolios/${portfolioSlug}`)
        }, 600)
    }

    return (
        <main className="mx-auto p-4">
            <div
                className="motion-safe:animate-revealBottom"
                style={{ animationDuration: "500ms" }}
            >
                <h1 className="text-2xl font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
                    Additional Comments
                </h1>
                <p className="mt-6 text-gray-700 sm:text-sm dark:text-gray-300">
                    Please provide any specific feedback or examples that would be helpful.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
                <Card className="p-4">
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="comments">Detailed Feedback</Label>
                            <Textarea
                                id="comments"
                                className="mt-2 min-h-[200px]"
                                placeholder="Share your thoughts and experiences..."
                                value={comments}
                                onChange={(e) => setComments(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                </Card>
                <div className="mt-6 flex justify-between">
                    <Button type="button" variant="ghost" asChild>
                        <Link href={`/feedback/${portfolioSlug}/chips`}>Back</Link>
                    </Button>
                    <Button
                        className="disabled:bg-gray-200 disabled:text-gray-500"
                        type="submit"
                        disabled={!comments.trim() || loading}
                        aria-disabled={!comments.trim() || loading}
                        isLoading={loading}
                    >
                        {loading ? "Submitting..." : "Submit Feedback"}
                    </Button>
                </div>
            </form>
        </main>
    )
} 