"use client"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/Textarea"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import React, { useState } from "react"

export default function Comment() {
  const [comment, setComment] = useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const params = useParams()
  const portfolioId = params?.id as string

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      console.log("Form submitted with comment:", comment)
      router.push(`/portfolios/${portfolioId}`)
    }, 600)
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
            <Link href={`/feedback/${portfolioId}/rating`}>Back</Link>
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
