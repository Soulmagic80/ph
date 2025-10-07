import { Skeleton } from "@/components/ui/Skeleton";

export default function Loading() {
    return (
        <main className="max-w-7xl mt-20 mx-auto px-5 md:px-10 py-10 space-y-14">
            {/* Overview */}
            <section>
                <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                    {/* Titel & Untertitel */}
                    <div>
                        <Skeleton className="h-6 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    {/* Content */}
                    <div className="md:col-span-2 md:pl-16">
                        <div className="bg-white dark:bg-gray-900 rounded-lg border border-gray-200 p-6 dark:border-gray-800">
                            <div className="w-full">
                                <div className="aspect-[4/3] w-full flex gap-4">
                                    {/* Main image */}
                                    <div className="flex-1 h-full">
                                        <Skeleton className="w-full h-full rounded-md" />
                                    </div>
                                    {/* Thumbnails */}
                                    <div className="flex flex-col gap-2 w-[20%] h-full">
                                        <Skeleton className="w-full h-[calc((100%-1.5rem)/4)] rounded-md" />
                                        <Skeleton className="w-full h-[calc((100%-1.5rem)/4)] rounded-md" />
                                        <Skeleton className="w-full h-[calc((100%-1.5rem)/4)] rounded-md" />
                                        <Skeleton className="w-full h-[calc((100%-1.5rem)/4)] rounded-md" />
                                    </div>
                                </div>
                                <Skeleton className="h-8 w-1/3 mt-6 rounded" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Details */}
            <section>
                <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                    <div>
                        <Skeleton className="h-6 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="md:col-span-2 md:pl-16">
                        <Skeleton className="h-8 w-1/2 mb-4" />
                        <Skeleton className="h-6 w-full mb-2" />
                        <Skeleton className="h-6 w-2/3 mb-2" />
                        <Skeleton className="h-6 w-1/3 mb-2" />
                        <Skeleton className="h-6 w-1/2 mb-2" />
                    </div>
                </div>
            </section>

            {/* Rating */}
            <section>
                <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                    <div>
                        <Skeleton className="h-6 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="md:col-span-2 md:pl-16">
                        <Skeleton className="h-8 w-1/3 mb-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Skeleton className="h-12 w-full rounded" />
                            <Skeleton className="h-12 w-full rounded" />
                            <Skeleton className="h-12 w-full rounded" />
                            <Skeleton className="h-12 w-full rounded" />
                        </div>
                        <Skeleton className="h-8 w-1/3 mt-8 mb-4" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            <Skeleton className="h-12 w-full rounded" />
                            <Skeleton className="h-12 w-full rounded" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Comments */}
            <section>
                <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                    <div>
                        <Skeleton className="h-6 w-2/3 mb-2" />
                        <Skeleton className="h-4 w-1/2" />
                    </div>
                    <div className="md:col-span-2 md:pl-16">
                        <Skeleton className="h-8 w-1/3 mb-4" />
                        <Skeleton className="h-20 w-full rounded mb-2" />
                        <Skeleton className="h-20 w-full rounded mb-2" />
                    </div>
                </div>
            </section>
        </main>
    );
} 