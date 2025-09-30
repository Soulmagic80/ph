
interface EmptyStateProps {
    title: string;
    description: string;
    buttonText?: string;
    buttonAction?: () => void;
    showButton?: boolean;
}

export function EmptyState({
    title,
    description,

}: EmptyStateProps) {
    return (
        <div className="relative">
            {/* Placeholder grid to show empty state overlay */}
            <ul
                role="list"
                className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
                <li className="h-44 rounded-lg bg-gray-100 dark:bg-gray-800" />
                <li className="h-44 rounded-lg bg-gray-100 dark:bg-gray-800" />
                <li className="hidden h-44 rounded-lg bg-gray-100 dark:bg-gray-800 sm:block" />
                <li className="hidden h-44 rounded-lg bg-gray-100 dark:bg-gray-800 sm:block" />
                <li className="hidden h-44 rounded-lg bg-gray-100 dark:bg-gray-800 sm:block" />
                <li className="hidden h-44 rounded-lg bg-gray-100 dark:bg-gray-800 sm:block" />
            </ul>

            {/* Empty state overlay */}
            <div className="absolute inset-x-0 bottom-0 flex h-32 flex-col items-center justify-center bg-gradient-to-t from-lightbeige-100 to-transparent dark:from-gray-950">
                <p className="font-medium text-gray-900 dark:text-gray-50">
                    {title}
                </p>
                <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    {description}
                </p>

            </div>
        </div>
    );
} 