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

            // Get existing image filenames from uploaded images
            const existingImages = data.images
                .filter((image: any) => image.uploaded && image.url)
                .map((image: any) => {
                    // Extract filename from URL (e.g., "main.jpg" from full URL)
                    const urlParts = image.url.split('/');
                    return urlParts[urlParts.length - 1]; // Get last part (filename)
                });


            const payload = {
                title: data.title,
                websiteUrl: data.websiteUrl,
                description: data.description,
                images: processedImages, // Only new images to upload
                existingImages: existingImages, // Existing image filenames to keep
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
