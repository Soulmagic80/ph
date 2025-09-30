"use client";

import PortfolioUploadForm from "@/components/portfolio/upload/PortfolioUploadForm";
import { useAuth } from "@/hooks/shared/useAuth";

export default function AdminUploadsPage() {
    const { user, profile } = useAuth();

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


            // Return success to trigger form clearing
            return { success: true, data: result };

        } catch (error) {
            console.error('Error uploading portfolio:', error);
            throw error; // Re-throw to let the form handle the error
        }
    };

    // Redirect if not admin
    if (user && profile && !profile.is_admin) {
        window.location.href = '/user/profile';
        return null;
    }

    if (!user || !profile?.is_admin) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                    Access Denied
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    You need admin privileges to access this page.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <PortfolioUploadForm onSubmit={handlePortfolioSubmit} isAdmin={true} />
        </div>
    );
}


