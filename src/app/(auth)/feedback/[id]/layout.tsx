"use client"
import { Button } from "@/components/ui/Button"
import { Logo } from "@/components/ui/Logo"
import useScroll from "@/lib/useScroll"
import { cx } from "@/lib/utils"
import Link from "next/link"
import { useParams, usePathname } from "next/navigation"
import React from "react"

interface Step {
  name: string
  href: string
}

const steps: Step[] = [
  { name: "Info", href: "/feedback/[id]/info" },
  { name: "Positive", href: "/feedback/[id]/rating/positive" },
  { name: "Negative", href: "/feedback/[id]/rating/negative" },
  { name: "Comment", href: "/feedback/[id]/comment" },
]

interface StepProgressProps {
  steps: Step[]
}

const StepProgress = ({ steps }: StepProgressProps) => {
  const pathname = usePathname()
  const currentStepIndex = steps.findIndex((step) => {
    // Extrahiere den Teil nach der ID
    const match = pathname?.match(/^\/feedback\/[^/]+(\/.*)$/);
    const pathSuffix = match ? `/feedback/[id]${match[1]}` : (pathname || "");
    return pathSuffix.startsWith(step.href);
  });

  return (
    <div aria-label="Feedback progress">
      <ol className="mx-auto flex w-32 flex-nowrap gap-1 md:w-fit">
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
  const scrolled = useScroll()
  const params = useParams()
  const portfolioId = params?.id as string

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 isolate z-50 flex items-center justify-between border-b border-gray-200 bg-white px-4 transition-all md:grid md:grid-cols-[200px_auto_200px] md:px-6 dark:border-gray-800 dark:bg-gray-950",
          scrolled ? "h-12" : "h-20",
        )}
      >
        <div className="hidden md:flex">
          <Logo />
        </div>
        <StepProgress steps={steps} />
        <Button variant="ghost" className="ml-auto w-fit" asChild>
          <Link href={portfolioId ? `/${portfolioId}` : "/"}>Cancel feedback process</Link>
        </Button>
      </header>
      <main id="main-content" className="mx-auto mb-20 mt-28 max-w-lg">
        {children}
      </main>
    </>
  )
}

export default Layout
