"use client"
import { Button } from "@/components/ui/Button"
import useScroll from "@/lib/useScroll"
import { cx } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import React from "react"

interface Step {
    name: string
    href: string
    path: string
}

interface StepProgressProps {
    steps: Step[]
}

const StepProgress = ({ steps }: StepProgressProps) => {
    const pathname = usePathname()
    const currentStepIndex = steps.findIndex((step) =>
        pathname.endsWith(step.path),
    )

    return (
        <div aria-label="Feedback progress">
            <ol className="mx-auto flex w-24 flex-nowrap gap-1 md:w-fit">
                {steps.map((step, index) => (
                    <li
                        key={step.name}
                        className={cx(
                            "h-1 w-12 rounded-full",
                            index <= currentStepIndex
                                ? "bg-blue-500"
                                : "bg-gray-300 dark:bg-gray-700",
                        )}
                    >
                        <span className="sr-only">
                            {step.name}{" "}
                            {index < currentStepIndex
                                ? "completed"
                                : index === currentStepIndex
                                    ? "current"
                                    : ""}
                        </span>
                    </li>
                ))}
            </ol>
        </div>
    )
}

const Layout = ({
    children,
}: Readonly<{
    children: React.ReactNode
}>) => {
    const scrolled = useScroll(15)
    const params = useParams()
    const portfolioId = params.id as string

    const steps: Step[] = [
        { name: "Info", path: "info", href: `/feedback/${portfolioId}/info` },
        { name: "Positive", path: "pchips", href: `/feedback/${portfolioId}/pchips` },
        { name: "Negative", path: "nchips", href: `/feedback/${portfolioId}/nchips` },
        { name: "Comments", path: "comments", href: `/feedback/${portfolioId}/comments` },
    ]

    return (
        <>
            <header
                className={cx(
                    "fixed inset-x-0 top-0 isolate z-50 flex items-center justify-between border-b border-gray-200 bg-white px-4 transition-all md:grid md:grid-cols-[200px_auto_200px] md:px-6 dark:border-gray-900 dark:bg-gray-925",
                    scrolled ? "h-12" : "h-20",
                )}
            >
                <Link href="/" aria-label="Home Link" className="hidden flex-nowrap items-center gap-0.5 md:flex">
                    <Image src="/logo-light.svg" alt="Logo" width={20} height={20} className="h-6 w-auto block dark:hidden" />
                    <Image src="/logo-dark.svg" alt="Logo" width={20} height={20} className="h-6 w-auto hidden dark:block" />
                </Link>
                <StepProgress steps={steps} />
                <Button variant="ghost" className="ml-auto w-fit" asChild>
                    <a href={`/portfolios/${portfolioId}`}>Back to portfolio</a>
                </Button>
            </header>
            <main id="main-content" className="mx-auto mb-20 mt-28 max-w-lg">
                {children}
            </main>
        </>
    )
}

export default Layout 