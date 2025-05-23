"use client"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { useFeedback } from "@/context/FeedbackContext"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import React from "react"

export default function CommentsPage() {
    const { comments, setComments, selectedPositiveChips, selectedNegativeChips, resetFeedback } = useFeedback()
    const [loading, setLoading] = React.useState(false)
    const [error, setError] = React.useState<string | null>(null)
    const router = useRouter()
    const params = useParams()
    const portfolioId = params.id as string
    const supabase = createClientComponentClient()

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            // Get portfolio ID from slug
            const { data: portfolio, error: portfolioError } = await supabase
                .from('portfolios')
                .select('id')
                .eq('id', portfolioId)
                .single()

            if (portfolioError || !portfolio) {
                throw new Error('Failed to find portfolio')
            }

            const response = await fetch('/api/feedback', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    portfolioId: portfolio.id,
                    positiveChips: selectedPositiveChips,
                    negativeChips: selectedNegativeChips,
                    comments: comments.trim()
                }),
            })

            if (!response.ok) {
                throw new Error('Failed to save feedback')
            }

            // Reset feedback context
            resetFeedback()

            // Redirect to success page or portfolio
            router.push(`/portfolios/${portfolioId}`)
        } catch (err) {
            setError('Failed to save feedback. Please try again.')
            setLoading(false)
        }
    }

    return (
        <main className="mx-auto p-4">
            <div
                style={{ animationDuration: "500ms" }}
                className="motion-safe:animate-revealBottom"
            >
                <h1 className="text-2xl font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
                    Additional Comments
                </h1>
                <p className="mt-6 text-gray-700 sm:text-sm dark:text-gray-300">
                    Share any additional thoughts or suggestions about this portfolio.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
                <div className="space-y-4">
                    <Textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="Enter your comments here..."
                        className="min-h-[200px]"
                    />
                    {error && (
                        <p className="text-sm text-red-500">{error}</p>
                    )}
                </div>
                <div className="mt-6 flex justify-between">
                    <Button type="button" variant="ghost" asChild>
                        <Link href={`/feedback/${portfolioId}/nchips`}>Back</Link>
                    </Button>
                    <Button
                        className="disabled:bg-gray-200 disabled:text-gray-500"
                        type="submit"
                        disabled={loading}
                        aria-disabled={loading}
                        isLoading={loading}
                    >
                        {loading ? "Submitting..." : "Submit Feedback"}
                    </Button>
                </div>
            </form>
        </main>
    )
} 