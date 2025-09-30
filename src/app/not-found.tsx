import { Button } from "@/components/ui/Button"
import Link from "next/link"

export default function NotFound() {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-white dark:bg-[#090E1A]">
      <p
        className="text-4xl font-semibold text-blue-500 sm:text-5xl"
        aria-hidden="true"
      >
        404
      </p>
      <h2 className="mt-4 text-2xl font-semibold text-gray-900 dark:text-gray-50">
        Page not found
      </h2>
      <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
        Sorry, we could not find the page you are looking for.
      </p>
      <Button asChild className="mt-8 bg-white text-gray-900 py-2 px-4 rounded-md border border-gray-200 hover:bg-gray-50 transition-colors text-sm dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700 dark:hover:bg-gray-700">
        <Link href="/">Go to the home page</Link>
      </Button>
    </div>
  )
}
