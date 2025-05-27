"use client"

import { Button } from "@/components/ui/Button"
import { supabase } from "@/lib/supabase"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface FeedbackChip {
    id: string
    name: string
    short_description: string
    icon_name: string
}

export default function NegativeRatingPage() {
    const router = useRouter()
    const params = useParams()
    if (!params?.id) throw new Error("Portfolio ID is required")
    const portfolioId = params.id
    const [chips, setChips] = useState<FeedbackChip[]>([])
    const [selectedChips, setSelectedChips] = useState<string[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchChips() {
            const { data, error } = await supabase
                .from("feedback_chips")
                .select("*")
                .eq("type", "negative")
                .order("name")

            if (error) {
                console.error("Error fetching chips:", error)
                return
            }

            setChips(data)
            setIsLoading(false)
        }

        fetchChips()
    }, [])

    const handleChipClick = (chipId: string) => {
        setSelectedChips((prev) => {
            if (prev.includes(chipId)) {
                return prev.filter((id) => id !== chipId)
            }
            if (prev.length >= 3) {
                return prev
            }
            return [...prev, chipId]
        })
    }

    const handleContinue = () => {
        // Store selected chips in session storage
        sessionStorage.setItem("negativeChips", JSON.stringify(selectedChips))
        router.push(`/feedback/${portfolioId}/comment`)
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className="space-y-8">
            <div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-50">
                    What could be improved?
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                    Select up to 3 aspects that could be improved.
                </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {chips.map((chip) => (
                    <button
                        key={chip.id}
                        onClick={() => handleChipClick(chip.id)}
                        className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${selectedChips.includes(chip.id)
                            ? "border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
                            : "border-gray-200 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
                            }`}
                    >
                        <div className="flex-1">
                            <h3 className="font-medium text-gray-900 dark:text-gray-50">
                                {chip.name}
                            </h3>
                            <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                {chip.short_description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>

            <div className="flex justify-between">
                <Button
                    variant="ghost"
                    onClick={() => router.push(`/feedback/${portfolioId}/rating/positive`)}
                >
                    Back
                </Button>
                <Button
                    onClick={handleContinue}
                    disabled={selectedChips.length === 0}
                >
                    Continue
                </Button>
            </div>
        </div>
    )
} 