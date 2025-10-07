"use client"

import FeedbackProcessChip from "@/components/feedback/process/FeedbackProcessChip"
import { Button } from "@/components/ui/Button"
import { createClient } from "@/lib/supabase"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const supabase = createClient()

interface FeedbackChip {
    id: string
    name: string
    short_description: string
    icon_name: string
    type: string
    category: string
}

export default function PositiveRatingPage() {
    const router = useRouter()
    const params = useParams()
    if (!params?.id) throw new Error("Portfolio ID is required")
    const portfolioId = params.id
    const [chips, setChips] = useState<FeedbackChip[]>([])
    const [selectedChips, setSelectedChips] = useState<string[]>(() => {
        if (typeof window !== "undefined" && portfolioId) {
            const key = `positiveChips_${portfolioId}`;
            const stored = sessionStorage.getItem(key);
            if (stored) {
                try {
                    return JSON.parse(stored);
                } catch {
                    return [];
                }
            }
        }
        return [];
    });
    const [isLoading, setIsLoading] = useState(true)

    // Scroll to top when component mounts
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    useEffect(() => {
        async function fetchChips() {
            try {
                const { data, error } = await supabase
                    .from("feedback_chips")
                    .select("*")
                    .eq("type", "positive")
                    .order("name");

                if (error) {
                    console.error("Error fetching chips:", error);
                    return;
                }

                setChips(data || []);
                setIsLoading(false);
            } catch (e) {
                console.error("Exception during fetch:", e);
            }
        }
        fetchChips();
    }, []);

    // Portfolio-spezifisch speichern
    useEffect(() => {
        const key = `positiveChips_${portfolioId}`;
        sessionStorage.setItem(key, JSON.stringify(selectedChips));
    }, [selectedChips, portfolioId]);

    const handleChipClick = (chipId: string) => {
        setSelectedChips((prev) => {
            if (prev.includes(chipId)) {
                return prev.filter((id) => id !== chipId)
            }
            if (prev.length >= 5) {
                return prev
            }
            return [...prev, chipId]
        })
    }

    const handleContinue = () => {
        router.push(`/feedback/${portfolioId}/rating/negative`)
    }

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <main className="mx-auto p-4">
            <div className="motion-safe:animate-revealBottom" style={{ animationDuration: "500ms" }}>
                <div>
                    <h1 className="heading-page">
                        What do you like about this portfolio?
                    </h1>
                    <p className="text-body mt-2">
                        Select up to 5 aspects that you find particularly good.
                    </p>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-1">
                    {chips.map((chip) => (
                        <FeedbackProcessChip
                            key={chip.id}
                            iconName={chip.icon_name}
                            title={chip.name}
                            category={chip.category}
                            description={chip.short_description}
                            selected={selectedChips.includes(chip.id)}
                            onClick={() => handleChipClick(chip.id)}
                        />
                    ))}
                </div>

                <div className="mt-6 flex justify-between">
                    <Button
                        variant="ghost"
                        onClick={() => router.push(`/feedback/${portfolioId}/info`)}
                    >
                        Back
                    </Button>
                    <Button
                        variant="primary"
                        className="text-sm font-medium"
                        onClick={handleContinue}
                        disabled={selectedChips.length === 0}
                    >
                        Continue
                    </Button>
                </div>
            </div>
        </main>
    )
}