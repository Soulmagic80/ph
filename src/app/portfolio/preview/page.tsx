"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { getPortfolioImageUrl, normalizeWebsiteUrl } from "@/lib/imageUtils";
import { ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PreviewData {
    title: string;
    websiteUrl: string;
    description: string;
    images: string[];
    portfolioId?: string; // For converting image paths to URLs
    tools: Array<{
        id: string;
        name: string;
        category: string;
    }>;
    tags: string[];
}

export default function PortfolioPreview() {
    const [previewData, setPreviewData] = useState<PreviewData | null>(null);

    useEffect(() => {
        // Load preview data from sessionStorage
        const data = sessionStorage.getItem('portfolio-preview');
        if (data) {
            try {
                setPreviewData(JSON.parse(data));
            } catch (error) {
                console.error('Error parsing preview data:', error);
            }
        }
    }, []);

    if (!previewData) {
        return (
            <div className="min-h-screen bg-lightbeige-100 dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                        No Preview Data
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Please go back to the upload form to preview your portfolio.
                    </p>
                    <Button onClick={() => window.close()}>
                        Close Preview
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-lightbeige-100 dark:bg-gray-950">
            {/* Header */}
            <div className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                                Portfolio Preview
                            </h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                This is how your portfolio will appear to visitors
                            </p>
                        </div>
                        <Button onClick={() => window.close()} variant="secondary">
                            Close Preview
                        </Button>
                    </div>
                </div>
            </div>

            {/* Portfolio Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800 overflow-hidden">

                    {/* Images */}
                    {previewData.images.length > 0 && (
                        <div className="aspect-[3/2] relative bg-gray-100 dark:bg-gray-800">
                            <Image
                                src={previewData.portfolioId
                                    ? getPortfolioImageUrl(previewData.portfolioId, previewData.images[0])
                                    : previewData.images[0]
                                }
                                alt={previewData.title}
                                fill
                                className="object-cover"
                                priority
                            />
                            {previewData.images.length > 1 && (
                                <div className="absolute bottom-4 right-4 bg-black/50 text-white px-2 py-1 rounded text-sm">
                                    +{previewData.images.length - 1} more
                                </div>
                            )}
                        </div>
                    )}

                    <div className="p-6">
                        {/* Title and Website */}
                        <div className="flex items-start justify-between mb-4">
                            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                {previewData.title}
                            </h1>
                            {previewData.websiteUrl && (
                                <Link
                                    href={normalizeWebsiteUrl(previewData.websiteUrl || '')}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                >
                                    <ExternalLink className="w-4 h-4" />
                                    Visit Site
                                </Link>
                            )}
                        </div>

                        {/* Description */}
                        {previewData.description && (
                            <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                                {previewData.description}
                            </p>
                        )}

                        {/* Tools */}
                        {previewData.tools.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                                    Tools Used
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {previewData.tools.map((tool) => (
                                        <Badge key={tool.id} variant="default" className="px-2 py-1 text-sm">
                                            {tool.name}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Tags */}
                        {previewData.tags.length > 0 && (
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
                                    Style Tags
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {previewData.tags.map((tag, index) => (
                                        <Badge key={index} variant="default" className="px-2 py-1 text-sm">
                                            {tag}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
