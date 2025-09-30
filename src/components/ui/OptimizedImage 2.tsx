"use client";

import Image from "next/image";
import { useState } from "react";

interface OptimizedImageProps {
    src: string;
    alt: string;
    width: number;
    height: number;
    className?: string;
    sizes?: string;
    quality?: number;
    priority?: boolean;
}

export default function OptimizedImage({
    src,
    alt,
    width,
    height,
    className = "",
    sizes,
    quality = 75,
    priority = false,
}: OptimizedImageProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Check if WebP is supported (simplified check)
    // const _supportsWebP = typeof window !== "undefined" &&
    //     window.HTMLCanvasElement &&
    //     document.createElement("canvas").toDataURL("image/webp").indexOf("data:image/webp") === 0;

    // For SVG files, use regular img tag to avoid Next.js Image optimization issues
    if (src.endsWith('.svg') || src.startsWith('data:image/svg')) {
        return (
            <img
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={className}
            />
        );
    }

    if (hasError) {
        return (
            <div
                className={`bg-gray-200 dark:bg-gray-800 flex items-center justify-center ${className}`}
                style={{ width, height }}
            >
                <span className="text-gray-500 text-sm">Failed to load</span>
            </div>
        );
    }

    return (
        <div className={`relative ${isLoading ? 'animate-pulse bg-gray-200 dark:bg-gray-800' : ''}`}>
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
                sizes={sizes}
                quality={quality}
                priority={priority}
                onLoad={() => setIsLoading(false)}
                onError={() => {
                    setIsLoading(false);
                    setHasError(true);
                }}
            />
        </div>
    );
}




