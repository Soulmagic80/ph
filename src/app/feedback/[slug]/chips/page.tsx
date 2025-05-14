"use client"
import { badgeVariants } from "@/components/Badge"
import { Button } from "@/components/Button"
import { Card } from "@/components/Card"
import { Checkbox } from "@/components/Checkbox"
import { Label } from "@/components/Label"
import { cx } from "@/lib/utils"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import React from "react"

interface Category {
    id: string
    title: string
    subcategories: string[]
}

interface CheckedItems {
    [categoryId: string]: boolean
}

interface CategoryItemProps {
    category: Category
    checked: boolean
    onCheckedChange: (categoryId: string, checked: boolean) => void
}

const feedbackCategories: Category[] = [
    {
        id: "1",
        title: "Technical Skills",
        subcategories: [
            "Problem Solving",
            "Code Quality",
            "Technical Knowledge",
        ],
    },
    {
        id: "2",
        title: "Project Management",
        subcategories: ["Organization", "Time Management", "Communication"],
    },
    {
        id: "3",
        title: "Leadership",
        subcategories: ["Team Collaboration", "Mentoring", "Decision Making"],
    },
    {
        id: "4",
        title: "Innovation",
        subcategories: ["Creative Solutions", "New Technologies", "Process Improvement"],
    },
    {
        id: "5",
        title: "Professional Growth",
        subcategories: ["Learning Ability", "Adaptability", "Initiative"],
    },
]

const CategoryItem = ({
    category,
    checked,
    onCheckedChange,
}: CategoryItemProps) => {
    return (
        <Card
            asChild
            className={cx(
                "cursor-pointer border-gray-300 p-5 transition-all active:scale-[99%] dark:border-gray-800",
                "has-[:checked]:border-blue-500",
                "duration-500 has-[:checked]:dark:border-blue-500",
                // base
                "focus-within:ring-2",
                // ring color
                "focus-within:ring-blue-200 focus-within:dark:ring-blue-700/30",
                // border color
                "focus-within:border-blue-500 focus-within:dark:border-blue-700",
            )}
        >
            <Label className="block" htmlFor={category.id}>
                <div className="mb-2 flex items-center gap-2.5">
                    <Checkbox
                        id={category.id}
                        name={category.title}
                        checked={checked}
                        onCheckedChange={(isChecked) =>
                            onCheckedChange(category.id, isChecked === true)
                        }
                    />
                    <span className="text-base font-medium sm:text-sm">
                        {category.title}
                    </span>
                </div>
                {category.subcategories.length > 0 && (
                    <ul className="ml-6 mt-2 flex flex-wrap gap-1.5">
                        {category.subcategories.map((subcategory) => (
                            <li
                                className={badgeVariants({ variant: "neutral" })}
                                key={subcategory}
                            >
                                {subcategory}
                            </li>
                        ))}
                    </ul>
                )}
            </Label>
        </Card>
    )
}

export default function FeedbackChips() {
    const [checkedItems, setCheckedItems] = React.useState<CheckedItems>({})
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()
    const params = useParams()
    const portfolioSlug = params.slug as string

    const handleCheckedChange = (categoryId: string, isChecked: boolean) => {
        setCheckedItems((prevCheckedItems) => ({
            ...prevCheckedItems,
            [categoryId]: isChecked,
        }))
    }

    const isAnyItemChecked = Object.values(checkedItems).some(Boolean)

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        setTimeout(() => {
            console.log("Selected feedback categories:", checkedItems)
            router.push(`/feedback/${portfolioSlug}/comments`)
        }, 400)
    }

    return (
        <main className="mx-auto p-4">
            <div
                style={{ animationDuration: "500ms" }}
                className="motion-safe:animate-revealBottom"
            >
                <h1 className="text-2xl font-semibold text-gray-900 sm:text-xl dark:text-gray-50">
                    What aspects would you like to provide feedback on?
                </h1>
                <p className="mt-6 text-gray-700 sm:text-sm dark:text-gray-300">
                    Select the areas where you feel you can provide meaningful feedback.
                </p>
            </div>
            <form onSubmit={handleSubmit} className="mt-4">
                <fieldset>
                    <legend className="sr-only">
                        Select feedback categories
                    </legend>
                    <div className="space-y-2">
                        {feedbackCategories.map((category, index) => (
                            <div
                                className="motion-safe:animate-revealBottom"
                                key={category.id}
                                style={{
                                    animationDuration: "600ms",
                                    animationDelay: `${100 + index * 50}ms`,
                                    animationFillMode: "backwards",
                                }}
                            >
                                <CategoryItem
                                    key={category.id}
                                    category={category}
                                    checked={checkedItems[category.id] || false}
                                    onCheckedChange={handleCheckedChange}
                                />
                            </div>
                        ))}
                    </div>
                </fieldset>
                <div className="mt-6 flex justify-between">
                    <Button type="button" variant="ghost" asChild>
                        <Link href={`/feedback/${portfolioSlug}/info`}>Back</Link>
                    </Button>
                    <Button
                        className="disabled:bg-gray-200 disabled:text-gray-500"
                        type="submit"
                        disabled={!isAnyItemChecked || loading}
                        aria-disabled={!isAnyItemChecked || loading}
                        isLoading={loading}
                    >
                        {loading ? "Submitting..." : "Continue"}
                    </Button>
                </div>
            </form>
        </main>
    )
} 