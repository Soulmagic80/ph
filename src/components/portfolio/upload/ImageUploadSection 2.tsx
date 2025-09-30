"use client";

import { Button } from "@/components/ui/Button";
import { type OptimizedImage } from "@/lib/imageOptimization";
import { Image as ImageIcon, Upload, X, Zap } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "sonner";

// Types
interface PortfolioImage {
    id: string;
    file: File;
    preview: string;
    uploaded?: boolean;
    url?: string;
    optimized?: OptimizedImage;
    isOptimizing?: boolean;
}

interface ImageUploadSectionProps {
    images: PortfolioImage[];
    onImagesChange: (images: PortfolioImage[]) => void;
    maxImages?: number;
    maxFileSize?: number; // in MB
    isReadOnly?: boolean;
}

// Validation constants
const ACCEPTED_FORMATS = ["image/jpeg", "image/png", "image/webp"];

export default function ImageUploadSection({
    images,
    onImagesChange,
    maxImages = 4,
    maxFileSize = 3,
    isReadOnly = false
}: ImageUploadSectionProps) {
    const [isDragActive, setIsDragActive] = useState(false);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Validate image file
    const validateImage = useCallback(async (file: File): Promise<boolean> => {
        // Check file type
        if (!ACCEPTED_FORMATS.includes(file.type)) {
            toast.error(`Please select JPG, PNG, or WebP images only`);
            return false;
        }

        // Check file size
        if (file.size > maxFileSize * 1024 * 1024) {
            toast.error(`Image must be smaller than ${maxFileSize}MB`);
            return false;
        }

        // Check image dimensions and aspect ratio
        return new Promise((resolve) => {
            const img = new window.Image();
            img.onload = () => {
                const aspectRatio = img.width / img.height;
                const targetAspectRatio = 3 / 2; // 1.5
                const tolerance = 0.1; // 10% tolerance

                // Check minimum dimensions
                if (img.width < 900 || img.height < 600) {
                    toast.error(`Image too small. Minimum size: 900x600px (Current: ${img.width}x${img.height}px)`);
                    resolve(false);
                    return;
                }

                // Check aspect ratio
                if (Math.abs(aspectRatio - targetAspectRatio) > tolerance) {
                    toast.error(`Image should be 3:2 format. Current ratio: ${(aspectRatio).toFixed(2)}:1 (Expected: 1.5:1)`);
                    resolve(false);
                    return;
                }

                resolve(true);
            };
            img.onerror = () => {
                toast.error('Invalid image file');
                resolve(false);
            };
            img.src = URL.createObjectURL(file);
        });
    }, [maxFileSize]);

    // Handle file drops/selection
    const onDrop = useCallback(async (acceptedFiles: File[]) => {
        if (images.length >= maxImages) {
            toast.error(`Maximum ${maxImages} images allowed`);
            return;
        }

        const remainingSlots = maxImages - images.length;
        const filesToProcess = acceptedFiles.slice(0, remainingSlots);

        if (acceptedFiles.length > remainingSlots) {
            toast.warning(`Only ${remainingSlots} more images can be added`);
        }

        setIsOptimizing(true);
        const validImages: PortfolioImage[] = [];

        for (const file of filesToProcess) {
            const isValid = await validateImage(file);
            if (isValid) {
                // Create initial image entry
                const imageId = Math.random().toString(36).substring(7);
                const newImage: PortfolioImage = {
                    id: imageId,
                    file,
                    preview: URL.createObjectURL(file),
                    uploaded: false,
                    isOptimizing: false, // Skip optimization
                };

                validImages.push(newImage);
            }
        }

        if (validImages.length > 0) {
            // Skip optimization to avoid CSP issues - just add images directly
            onImagesChange([...images, ...validImages]);
            setIsOptimizing(false);
        }

        setIsOptimizing(false);
    }, [images, maxImages, onImagesChange, validateImage]);

    // Setup dropzone
    const { getRootProps, isDragAccept, isDragReject } = useDropzone({
        onDrop,
        accept: {
            'image/jpeg': ['.jpg', '.jpeg'],
            'image/png': ['.png'],
            'image/webp': ['.webp']
        },
        maxFiles: maxImages,
        disabled: images.length >= maxImages || isReadOnly,
        onDragEnter: () => setIsDragActive(true),
        onDragLeave: () => setIsDragActive(false),
        onDropAccepted: () => setIsDragActive(false),
        onDropRejected: () => setIsDragActive(false),
        noClick: true, // Disable click on dropzone area
    });

    // Handle browse files click
    const handleBrowseClick = () => {
        fileInputRef.current?.click();
    };

    // Remove image
    const removeImage = useCallback((imageId: string) => {
        const updatedImages = images.filter(img => img.id !== imageId);
        onImagesChange(updatedImages);

        // Clean up preview URL
        const imageToRemove = images.find(img => img.id === imageId);
        if (imageToRemove) {
            URL.revokeObjectURL(imageToRemove.preview);
        }
    }, [images, onImagesChange]);

    // Move image (reorder) - Currently unused but kept for future drag & drop functionality
    // const moveImage = useCallback((fromIndex: number, toIndex: number) => {
    //     const newImages = [...images];
    //     const [movedImage] = newImages.splice(fromIndex, 1);
    //     newImages.splice(toIndex, 0, movedImage);
    //     onImagesChange(newImages);
    // }, [images, onImagesChange]);

    // Get dropzone styling
    const getDropzoneClasses = () => {
        const baseClasses = "border border-dashed rounded-lg p-8 text-center transition-all duration-200";

        if (images.length >= maxImages) {
            return `${baseClasses} border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 cursor-not-allowed`;
        }

        if (isDragReject) {
            return `${baseClasses} border-red-300 bg-red-50 dark:bg-red-900/20`;
        }

        if (isDragAccept || isDragActive) {
            return `${baseClasses} border-blue-400 bg-blue-50 dark:bg-blue-900/20`;
        }

        return `${baseClasses} border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600`;
    };

    return (
        <div className="space-y-6">
            {/* Dropzone */}
            <div {...getRootProps()} className={getDropzoneClasses()}>
                <div className="flex flex-col items-center">
                    {images.length >= maxImages ? (
                        <>
                            <ImageIcon className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-500 font-medium">Maximum images reached</p>
                            <p className="text-sm text-gray-400">
                                Remove an image to add another one
                            </p>
                        </>
                    ) : (
                        <>
                            <Upload className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-700 dark:text-gray-300 font-medium mb-4">
                                Drop images here
                            </p>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={handleBrowseClick}
                                disabled={images.length >= maxImages}
                                className="mb-3"
                            >
                                Browse Files
                            </Button>
                            <p className="text-sm text-gray-500">
                                3:2 format • Min 900x600px • Max {maxFileSize}MB • JPG, PNG, WebP • Up to {maxImages} images
                            </p>
                            {isOptimizing && (
                                <div className="mt-2 flex items-center gap-2 text-sm text-blue-600">
                                    <Zap className="h-4 w-4 animate-pulse" />
                                    Optimizing images for better performance...
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Hidden file input for browse button */}
            <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/jpeg,image/png,image/webp"
                onChange={async (e) => {
                    const files = Array.from(e.target.files || []);
                    await onDrop(files);
                    // Reset input
                    e.target.value = '';
                }}
                className="hidden"
            />

            {/* Thumbnail Grid - Always show 5 slots */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                    Portfolio Images ({images.length}/{maxImages}) *
                </h3>

                <div className="grid grid-cols-4 gap-4">
                    {Array.from({ length: maxImages }).map((_, index) => {
                        const image = images[index];

                        if (image) {
                            // Show uploaded image

                            return (
                                <div key={image.id || `image-${index}`} className="relative group">
                                    <div className="aspect-[3/2] rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 border border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center">
                                        {(image.url || image.preview) ? (
                                            <Image
                                                src={image.url || image.preview}
                                                alt={`Portfolio image ${index + 1}`}
                                                width={400}
                                                height={267}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    // Show broken image placeholder
                                                    const parent = e.currentTarget.parentElement;
                                                    if (parent) {
                                                        parent.innerHTML = `
                                                            <div class="flex flex-col items-center justify-center text-gray-400 p-4">
                                                                <svg class="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
                                                                </svg>
                                                                <span class="text-xs text-center">Image unavailable</span>
                                                            </div>
                                                        `;
                                                    }
                                                }}
                                                unoptimized={true}
                                            />
                                        ) : (
                                            <div className="flex flex-col items-center justify-center text-gray-400">
                                                <ImageIcon className="w-8 h-8 mb-2" />
                                                <span className="text-xs">No image</span>
                                            </div>
                                        )}

                                        {/* Optimization overlay */}
                                        {image.isOptimizing && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <div className="text-white text-center">
                                                    <Zap className="h-6 w-6 animate-pulse mx-auto mb-1" />
                                                    <div className="text-xs">Optimizing...</div>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Remove button */}
                                    <button
                                        type="button"
                                        onClick={() => removeImage(image.id)}
                                        className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-sm"
                                        aria-label={`Remove image ${index + 1}`}
                                        disabled={image.isOptimizing}
                                    >
                                        <X className="h-4 w-4" />
                                    </button>

                                    {/* Primary indicator */}
                                    {index === 0 && (
                                        <div className="absolute bottom-2 left-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                                            Main
                                        </div>
                                    )}

                                    {/* Optimization status */}
                                    {image.optimized && !image.isOptimizing && (
                                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
                                            <Zap className="h-3 w-3" />
                                            -{Math.round(image.optimized.compressionRatio)}%
                                        </div>
                                    )}
                                </div>
                            );
                        } else {
                            // Show empty slot
                            return (
                                <div key={`empty-${index}`} className="aspect-[3/2] rounded-lg border border-dashed border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-center">
                                    <ImageIcon className="h-6 w-6 text-gray-400" />
                                </div>
                            );
                        }
                    })}
                </div>

                {images.length > 0 && (
                    <p className="text-xs text-gray-500 text-center">
                        First image will be used as thumbnail
                    </p>
                )}
            </div>


        </div>
    );
}
