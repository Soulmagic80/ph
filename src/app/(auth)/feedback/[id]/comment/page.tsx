"use client"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import { createClient } from "@/lib/supabase"
import { useParams, useRouter } from "next/navigation"
import React, { useEffect, useState } from "react"
import { toast } from "sonner"

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

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

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
      const { error: transactionError } = await (supabase.rpc as any)('save_portfolio_feedback', {
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

      // Show success toast
      toast.success("Thank you for your feedback! Your input helps improve this portfolio.")

      // Redirect to portfolio page
      router.push(`/${portfolioId}`)
    } catch (error) {
      console.error("Error saving feedback:", error)
      setLoading(false)
    }
  }

  return (
    <main className="mx-auto p-4">
      <div className="motion-safe:animate-revealBottom" style={{ animationDuration: "500ms" }}>
        <div>
          <h1 className="heading-page">
            Add a personal comment
          </h1>
          <p className="text-body mt-2">
            Your personal feedback is <strong>incredibly valuable</strong> to the portfolio owner. While optional, a <strong>thoughtful comment</strong> can provide <strong>specific insights</strong> that help them understand what works well and what could be improved. <br /><br />Consider sharing what <strong>caught your attention</strong>, <strong>specific suggestions</strong>, or <strong>encouragement</strong> – your words can make a <strong>real difference</strong> in their creative journey.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-6">
          <div className="flex flex-col gap-4">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your comment here..."
              rows={4}
            />
            <div className="flex justify-between">
              <Button
                type="button"
                variant="ghost"
                onClick={() => router.push(`/feedback/${portfolioId}/rating/negative`)}
                className="text-sm font-medium"
              >
                Back
              </Button>
              <Button
                type="submit"
                variant="primary"
                className="text-sm font-medium"
                disabled={loading}
                aria-disabled={loading}
                isLoading={loading}
              >
                {loading ? "Saving..." : "Submit Feedback"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </main>
  )
}