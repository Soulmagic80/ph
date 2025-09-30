// Force dynamic rendering for this page
export const dynamic = 'force-dynamic';

export default function GettingStartedPage() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-4xl">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-6">
                Getting Started
            </h1>
            <div className="prose dark:prose-invert max-w-none">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                    Content coming soon...
                </p>
            </div>
        </main>
    );
}
