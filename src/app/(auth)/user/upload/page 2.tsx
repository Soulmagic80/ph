"use client";

import PortfolioUploadForm from "@/components/portfolio/upload/PortfolioUploadForm";

export default function Upload() {
    const handlePortfolioSubmit = async (data: any) => {
        try {
            // Convert File objects to base64 for API transmission
            const processedImages = await Promise.all(
                data.images.map(async (image: any) => {
                    return new Promise((resolve) => {
                        const reader = new FileReader();
                        reader.onload = () => {
                            resolve({
                                id: image.id,
                                file: reader.result as string, // base64 string
                                fileName: image.file.name,
                                contentType: image.file.type
                            });
                        };
                        reader.readAsDataURL(image.file);
                    });
                })
            );

            const payload = {
                title: data.title,
                websiteUrl: data.websiteUrl,
                description: data.description,
                images: processedImages,
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

            console.log('Portfolio uploaded successfully:', result);

        } catch (error) {
            console.error('Error uploading portfolio:', error);
            throw error; // Re-throw to let the form handle the error
        }
    };

    return (
        <PortfolioUploadForm onSubmit={handlePortfolioSubmit} />
    );
}
