"use client"
import { Button } from "@/components/ui/Button"
import { useParams, useRouter } from "next/navigation"
import React from "react"

export default function Info() {
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const params = useParams()
  const portfolioId = params?.id as string

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