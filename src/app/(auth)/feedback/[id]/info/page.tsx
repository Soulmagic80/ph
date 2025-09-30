"use client"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase"
import { useParams, useRouter } from "next/navigation"
import React, { useEffect } from "react"

const supabase = createClient()

export default function Info() {
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const params = useParams()
  const portfolioId = params?.id as string

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    async function checkFeedbackStatus() {
      try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          router.push('/auth/login')
          return
        }

        const { data: feedbackData } = await supabase
          .from("feedback_status")
          .select("status")
          .eq("portfolio_id", portfolioId)
          .eq("user_id", user.id)
          .maybeSingle()

        // Only redirect if status is completed AND user didn't just reset it
        if ((feedbackData as any)?.status === "completed") {
          // Check if this was just reset by checking the updated_at timestamp
          const { data: recentData } = await supabase
            .from("feedback_status")
            .select("updated_at")
            .eq("portfolio_id", portfolioId)
            .eq("user_id", user.id)
            .single()

          const updatedAt = new Date(recentData?.updated_at || 0)
          const now = new Date()
          const timeDiff = now.getTime() - updatedAt.getTime()

          // If updated more than 5 seconds ago, it's a genuine completed status
          if (timeDiff > 5000) {
            router.push(`/${portfolioId}`)
          }
        }
      } catch (error) {
        console.error("Error checking feedback status:", error)
      }
    }

    checkFeedbackStatus()
  }, [portfolioId, router])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      router.push(`/feedback/${portfolioId}/rating/positive`)
    }, 600)
  }

  return (
    <main className="mx-auto p-4">
      <div
        className="motion-safe:animate-revealBottom"
        style={{ animationDuration: "500ms" }}
      >
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
          Give Feedback
        </h1>
        <div className="mt-6 space-y-4 text-gray-700 sm:text-sm dark:text-gray-300">
          <p>
            You are about to give feedback on a portfolio. The process consists of 4 steps:
          </p>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Information about the feedback process (this page)</li>
            <li>Select positive aspects (max. 5)</li>
            <li>Identify areas for improvement (max. 3)</li>
            <li>Optional: Add a personal comment</li>
          </ol>
          <p>
            Your feedback helps the portfolio owner improve their work. Please be constructive and respectful in your criticism.
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="mt-6">
        <div className="flex justify-end">
          <Button
            type="submit"
            variant="primary"
            className="text-sm font-medium"
            disabled={loading}
            aria-disabled={loading}
            isLoading={loading}
          >
            {loading ? "Loading..." : "Continue"}
          </Button>
        </div>
      </form>
    </main>
  )
}