"use client"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"

const supabase = createClient()

export default function Comment() {
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const params = useParams()
  if (!params?.id) throw new Error("Portfolio ID is required")
  const portfolioId = params.id

  // Portfolio-spezifischer Initialwert
  const [comment, setComment] = useState(() => {
    if (typeof window !== "undefined" && portfolioId) {
      const key = `feedbackComment_${portfolioId}`;
      const stored = sessionStorage.getItem(key);
      if (stored) {
        return stored;
      }
    }
    return "";
  });

  // Portfolio-spezifisch speichern
  useEffect(() => {
    const key = `feedbackComment_${portfolioId}`;
    sessionStorage.setItem(key, comment);
  }, [comment, portfolioId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      if (userError || !user) throw new Error("User not found")

      // Get selected chips from session storage
      const positiveChips = JSON.parse(sessionStorage.getItem(`positiveChips_${portfolioId}`) || "[]")
      const negativeChips = JSON.parse(sessionStorage.getItem(`negativeChips_${portfolioId}`) || "[]")

      // Start a transaction
      const { error: transactionError } = await supabase.rpc('save_portfolio_feedback', {
        p_portfolio_id: portfolioId,
        p_user_id: user.id,
        p_positive_chips: positiveChips,
        p_negative_chips: negativeChips,
        p_comment: comment
      })

      if (transactionError) throw transactionError

      // Clear session storage
      sessionStorage.removeItem(`positiveChips_${portfolioId}`)
      sessionStorage.removeItem(`negativeChips_${portfolioId}`)
      sessionStorage.removeItem(`feedbackComment_${portfolioId}`)

      // Redirect to portfolio page
      router.push(`/${portfolioId}`)
    } catch (error) {
      console.error("Error saving feedback:", error)
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto p-4">
      <div
        className="motion-safe:animate-revealBottom"
        style={{ animationDuration: "500ms" }}
      >
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
          Share your thoughts
        </h1>
        <p className="mt-6 text-gray-700 sm:text-sm dark:text-gray-300">
          Provide detailed feedback to help the designer improve their portfolio.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <fieldset>
          <legend className="sr-only">Write your feedback</legend>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="What did you like? What could be improved?"
            className="min-h-[200px]"
            required
          />
        </fieldset>
        <div className="mt-6 flex justify-between">
          <Button type="button" variant="ghost" asChild>
            <Link href={`/feedback/${portfolioId}/rating/negative`}>Back</Link>
          </Button>
          <Button
            className="disabled:bg-gray-200 disabled:text-gray-500"
            type="submit"
            disabled={!comment.trim() || loading}
            aria-disabled={!comment.trim() || loading}
            isLoading={loading}
          >
            {loading ? "Submitting..." : "Submit Feedback"}
          </Button>
        </div>
      </form>
    </main>
  )
}