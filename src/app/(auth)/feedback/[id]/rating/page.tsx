"use client"
import { Button } from "@/components/ui/Button"
import {
  RadioCardGroup,
  RadioCardIndicator,
  RadioCardItem,
} from "@/components/ui/RadioCardGroup"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import React, { useState } from "react"

const ratingOptions = [
  { value: "1", label: "Poor" },
  { value: "2", label: "Fair" },
  { value: "3", label: "Good" },
  { value: "4", label: "Very Good" },
  { value: "5", label: "Excellent" },
]

export default function Rating() {
  const [selectedRating, setSelectedRating] = useState("")
  const [loading, setLoading] = React.useState(false)
  const router = useRouter()
  const params = useParams()
  const portfolioId = params?.id as string

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      console.log("Form submitted with rating:", selectedRating)
      router.push(`/feedback/${portfolioId}/comment`)
    }, 600)
  }

  return (
    <main className="mx-auto p-4">
      <div
        className="motion-safe:animate-revealBottom"
        style={{ animationDuration: "500ms" }}
      >
        <h1 className="text-2xl font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
          How would you rate this portfolio?
        </h1>
        <p className="mt-6 text-gray-700 sm:text-sm dark:text-gray-300">
          Select a rating that best reflects your overall impression.
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <fieldset>
          <legend className="sr-only">Select rating</legend>
          <RadioCardGroup
            value={selectedRating}
            onValueChange={(value) => setSelectedRating(value)}
            required
            aria-label="Portfolio rating"
          >
            {ratingOptions.map((option, index) => (
              <div
                className="motion-safe:animate-revealBottom"
                key={option.value}
                style={{
                  animationDuration: "600ms",
                  animationDelay: `${100 + index * 50}ms`,
                  animationFillMode: "backwards",
                }}
              >
                <RadioCardItem
                  className="active:scale-[99%] dark:bg-gray-925"
                  key={option.value}
                  value={option.value}
                  style={{
                    animationDuration: "600ms",
                    animationDelay: `${100 + index * 50}ms`,
                    animationFillMode: "backwards",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <RadioCardIndicator />
                    <span className="block sm:text-sm">{option.label}</span>
                  </div>
                </RadioCardItem>
              </div>
            ))}
          </RadioCardGroup>
        </fieldset>
        <div className="mt-6 flex justify-between">
          <Button type="button" variant="ghost" asChild>
            <Link href={`/feedback/${portfolioId}/info`}>Back</Link>
          </Button>
          <Button
            className="disabled:bg-gray-200 disabled:text-gray-500"
            type="submit"
            disabled={!selectedRating || loading}
            aria-disabled={!selectedRating || loading}
            isLoading={loading}
          >
            {loading ? "Submitting..." : "Continue"}
          </Button>
        </div>
      </form>
    </main>
  )
}
