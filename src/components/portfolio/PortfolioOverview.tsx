import { ArrowUpCircleIcon, StarIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { useState } from "react";

interface PortfolioOverviewProps {
    title: string;
    images: string[];
}

export default function PortfolioOverview({ title, images }: PortfolioOverviewProps) {
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    return (
        <section aria-labelledby="portfolio-overview-heading">
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                {/* Left column: Title and subtitle */}
                <div>
                    <h2
                        id="portfolio-overview-heading"
                        className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
                    >
                        Portfolio Overview
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        View and interact with this portfolio. You can upvote, rate, or visit the website.
                    </p>
                </div>
                {/* Right column: Content */}
                <div className="md:col-span-2 md:pl-16">
                    <div className="bg-gray-50 rounded-md border border-gray-200 p-6 dark:border-gray-800">
                        <div className="w-full">
                            <div className="aspect-[500/300] w-full flex gap-4">
                                {/* Hauptbild */}
                                <div className="flex-1 h-full">
                                    <div className="rounded-md h-full">
                                        {images[selectedImageIndex] ? (
                                            <Image
                                                src={images[selectedImageIndex]}
                                                alt={title}
                                                width={500}
                                                height={300}
                                                className="w-full h-full object-cover rounded-md"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-100 dark:bg-gray-800 rounded-md flex items-center justify-center">
                                                <span className="text-gray-400 dark:text-gray-600">No image available</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {/* Thumbnails */}
                                <div className="flex flex-col gap-4 w-[20%] h-full">
                                    {[0, 1, 2, 3].map((index) => (
                                        <div
                                            key={index}
                                            className={`w-full h-[calc((100%-48px)/4)] rounded-md cursor-pointer transition-all ${selectedImageIndex === index
                                                ? 'outline outline-2 outline-blue-500 outline-offset-2'
                                                : 'bg-gray-200 dark:bg-gray-700'
                                                }`}
                                            onClick={() => setSelectedImageIndex(index)}
                                        >
                                            {images[index] && (
                                                <Image
                                                    src={images[index]}
                                                    alt={`${title} - Image ${index + 1}`}
                                                    width={120}
                                                    height={72}
                                                    className="w-full h-full object-cover rounded-md"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <button className="w-full mt-8 bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition-colors text-sm">
                                Visit website
                            </button>
                            <div className="flex flex-col lg:flex-row gap-2 mt-4">
                                <button className="flex-1 flex items-center justify-center gap-2 bg-white text-supergrey-100 py-2 px-4 rounded-md border border-beige-300 hover:bg-gray-50 transition-colors text-sm">
                                    <ArrowUpCircleIcon className="w-5 h-5" />
                                    <span>Upvote this portfolio</span>
                                </button>
                                <button className="flex-1 flex items-center justify-center gap-2 bg-white text-supergrey-100 py-2 px-4 rounded-md border border-beige-300 hover:bg-gray-50 transition-colors text-sm">
                                    <StarIcon className="w-5 h-5" />
                                    <span>Rate this portfolio</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
} 