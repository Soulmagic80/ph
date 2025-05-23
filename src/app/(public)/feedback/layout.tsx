"use client"
import { FeedbackProvider } from "@/context/FeedbackContext"

export default function FeedbackLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return <FeedbackProvider>{children}</FeedbackProvider>
} 