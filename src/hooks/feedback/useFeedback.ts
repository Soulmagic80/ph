"use client"
import { useState } from "react"

export function useFeedback() {
    const [selectedPositiveChips, setSelectedPositiveChips] = useState<string[]>([])
    const [selectedNegativeChips, setSelectedNegativeChips] = useState<string[]>([])
    const [comments, setComments] = useState("")

    const resetFeedback = () => {
        setSelectedPositiveChips([])
        setSelectedNegativeChips([])
        setComments("")
    }

    return {
        selectedPositiveChips,
        selectedNegativeChips,
        comments,
        setSelectedPositiveChips,
        setSelectedNegativeChips,
        setComments,
        resetFeedback,
    }
} 