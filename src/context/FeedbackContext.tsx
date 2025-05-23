"use client"
import React, { createContext, useContext, useState } from "react"

interface FeedbackContextType {
    selectedPositiveChips: string[]
    selectedNegativeChips: string[]
    comments: string
    setSelectedPositiveChips: (chips: string[]) => void
    setSelectedNegativeChips: (chips: string[]) => void
    setComments: (comments: string) => void
    resetFeedback: () => void
}

const FeedbackContext = createContext<FeedbackContextType | undefined>(undefined)

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
    const [selectedPositiveChips, setSelectedPositiveChips] = useState<string[]>([])
    const [selectedNegativeChips, setSelectedNegativeChips] = useState<string[]>([])
    const [comments, setComments] = useState("")

    const resetFeedback = () => {
        setSelectedPositiveChips([])
        setSelectedNegativeChips([])
        setComments("")
    }

    return (
        <FeedbackContext.Provider
            value={{
                selectedPositiveChips,
                selectedNegativeChips,
                comments,
                setSelectedPositiveChips,
                setSelectedNegativeChips,
                setComments,
                resetFeedback,
            }}
        >
            {children}
        </FeedbackContext.Provider>
    )
}

export function useFeedback() {
    const context = useContext(FeedbackContext)
    if (context === undefined) {
        throw new Error("useFeedback must be used within a FeedbackProvider")
    }
    return context
} 