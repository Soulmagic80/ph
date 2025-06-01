"use client"
import { Button } from "@/components/ui/Button"
import {
  RadioCardGroup,
  RadioCardIndicator,
  RadioCardItem,
} from "@/components/ui/RadioCardGroup"
import { useParams, useRouter } from "next/navigation"
import React, { useState } from "react"

const feedbackTypes = [
  { value: "design", label: "Design" },
  { value: "ux", label: "User Experience" },
  { value: "content", label: "Content" },
  { value: "functionality", label: "Functionality" },
  { value: "other", label: "Other" },
]

export default function Info() {
  const [selectedFeedbackType, setSelectedFeedbackType] = useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const params = useParams()
  const portfolioId = params?.id as string

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      console.log("Form submitted with feedback type:", selectedFeedbackType)
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
          What would you like to provide feedback on?
        </h1>
        <p className="mt-6 text-gray-700 sm:text-sm dark:text-gray-300">
          Select the main aspect you want to focus on in your feedback.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <fieldset>
          <legend className="sr-only">Select feedback type</legend>
          <RadioCardGroup
            value={selectedFeedbackType}
            onValueChange={(value) => setSelectedFeedbackType(value)}
            required
            aria-label="Feedback type"
          >
            {feedbackTypes.map((type, index) => (
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
        <div className="mt-6 flex justify-end">
          <Button
            className="disabled:bg-gray-200 disabled:text-gray-500"
            type="submit"
            disabled={!selectedFeedbackType || loading}
            aria-disabled={!selectedFeedbackType || loading}
            isLoading={loading}
          >
            {loading ? "Submitting..." : "Continue"}
          </Button>
        </div>
      </form>
    </main>
  )
}
