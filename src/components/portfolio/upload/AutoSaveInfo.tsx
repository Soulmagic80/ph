export function AutoSaveInfo() {
    return (
        <div className="relative mt-16 mb-8">
            {/* Content */}
            <div className="relative flex flex-col items-center justify-center py-12 px-6">
                {/* Icon */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                    <svg className="h-6 w-6 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                </div>

                {/* Text */}
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50 mb-2">
                    Your work is automatically saved
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
                    Every change you make is saved in real-time. You can safely close this page and continue later.
                </p>

                {/* Decorative element */}
                <div className="mt-6 flex space-x-1">
                    <div className="h-1 w-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                    <div className="h-1 w-4 bg-gray-300 dark:bg-gray-600 rounded-full"></div>
                    <div className="h-1 w-2 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}

