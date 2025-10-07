"use client";

import PortfolioUploadForm from "@/components/portfolio/upload/PortfolioUploadForm";

export default function PortfolioUpload() {

    const handlePortfolioSubmit = async (data: any) => {
        try {
            // Convert File objects to base64 for API transmission
            // Only process NEW images (not uploaded yet), skip existing ones
            const processedImages = await Promise.all(
                data.images
                    .filter((image: any) => !image.uploaded && image.file && image.file.size > 0) // Only new images
                    .map(async (image: any) => {
                        return new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                                resolve({
                                    id: image.id,
                                    file: reader.result as string, // base64 string
                                    fileName: image.file.name,
                                    contentType: image.file.type,
                                    isNew: true // Mark as new image
                                });
                            };
                            reader.readAsDataURL(image.file);
                        });
                    })
            );

            // Get existing image URLs from uploaded images
            const existingImageUrls = data.images
                .filter((image: any) => image.uploaded && image.url)
                .map((image: any) => image.url); // Keep full URL

            console.log('📤 Submitting images:', {
                newImages: processedImages.length,
                existingImages: existingImageUrls
            });

            const payload = {
                title: data.title,
                websiteUrl: data.websiteUrl,
                description: data.description,
                images: processedImages.length > 0 ? processedImages : existingImageUrls, // New images OR existing URLs
                tools: data.tools,
                tags: data.tags || []
            };

            const response = await fetch('/api/portfolios/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Upload failed');
            }


        } catch (error) {
            console.error('Error uploading portfolio:', error);
            throw error; // Re-throw to let the form handle the error
        }
    };

    return (
        <div>
            <PortfolioUploadForm onSubmit={handlePortfolioSubmit} />
        </div>
    );
}
