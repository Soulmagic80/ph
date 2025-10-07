"use client";

import { Divider } from "@/components/ui/Divider";
import { useAutoSave } from "@/hooks/portfolio/useAutoSave";
import { usePortfolioStatus } from "@/hooks/portfolio/usePortfolioStatus";
import { useAuth } from "@/hooks/shared/useAuth";
import { getPortfolioImageUrl } from '@/lib/imageUtils';
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { StatusBadge } from "./StatusBadge";
import BasicInfoSection from "./BasicInfoSection";
import ImageUploadSection from "./ImageUploadSection";
import StyleSection from "./StyleSection";
import TagsSection from "./TagsSection";
import ToolsSection from "./ToolsSection";
import UploadRestrictions from "./UploadRestrictions";

// Types
interface PortfolioImage {
    id: string;
    file: File;
    preview: string;
    uploaded?: boolean;
    url?: string;
}

interface Tool {
    id: string;
    name: string;
    category: string;
}

interface Style {
    id: string;
    name: string;
    display_name: string;
    category: string | null;
}

interface PortfolioFormData {
    title: string;
    websiteUrl: string;
    description: string;
    images: PortfolioImage[];
    tags: string[];
    tools: Tool[];
    styles: Style[];
}

interface PortfolioUploadFormProps {
    onSubmit?: (data: PortfolioFormData) => Promise<void | { success: boolean; data?: any }>;
    isAdmin?: boolean;
}


export default function PortfolioUploadForm({ onSubmit, isAdmin = false }: PortfolioUploadFormProps) {
    const router = useRouter();
    const titleInputRef = useRef<HTMLInputElement>(null);
    const [formData, setFormData] = useState<PortfolioFormData>({
        title: "",
        websiteUrl: "",
        description: "",
        images: [],
        tags: [],
        tools: [],
        styles: [],
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableTools, setAvailableTools] = useState<Tool[]>([]);
    const [isLoadingTools, setIsLoadingTools] = useState(true);
    const [availableStyles, setAvailableStyles] = useState<Style[]>([]);
    const [isLoadingStyles, setIsLoadingStyles] = useState(true);
    const [, setCanUpload] = useState(isAdmin); // Admins can always upload
    const [refreshTrigger] = useState(0);

    // Get current user and portfolio status
    const { user } = useAuth();
    const portfolioStatusHook = usePortfolioStatus();

    // For admin users, ignore portfolio status and always allow fresh uploads
    const {
        canEdit,
        portfolio,
        refetch,
        isLoading: statusLoading,
        status,
        approved: _approved,
        published,
        is_visible,
        canSubmit,
        canPreview,
        canClearAll,
        showEditButton,
        showWithdrawButton,
        statusMessage
    } = isAdmin ? {
        canEdit: true,
        portfolio: null, // Always null for admin
        refetch: async () => { },
        isLoading: false,
        status: 'draft' as const,
        approved: false,
        published: false,
        is_visible: true,
        canSubmit: true,
        canPreview: true,
        canClearAll: true,
        showEditButton: false,
        showWithdrawButton: false,
        statusMessage: 'Admin can upload unlimited portfolios'
    } : portfolioStatusHook;

    // Determine if form should be read-only
    // Read-only if: pending, approved (in queue), or published (online)
    // Editable if: draft, declined, or published (offline)
    const isReadOnly = !isAdmin && portfolio && !statusLoading && (
        status === 'pending' || 
        (status === 'approved' && !published) || 
        (status === 'approved' && published && is_visible)
    );

    // Handle anchor scrolling on component mount
    useEffect(() => {
        const hash = window.location.hash;
        if (hash) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                const element = document.querySelector(hash);
                if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            }, 100);
        }
    }, []);

    // Load submitted portfolio data when portfolio exists (both read-only and editable)
    // Skip for admin users - they should always have a clean form
    useEffect(() => {
        if (!isAdmin && portfolio && portfolio.images && portfolio.images.length > 0) {
            // Check if portfolio images are already correctly loaded
            const portfolioImagesAlreadyLoaded = formData.images.length > 0 &&
                formData.images.some(img => img.url && img.url.includes(portfolio.id));


            if (!portfolioImagesAlreadyLoaded) {
                // Convert portfolio data to form format
                const portfolioImages = portfolio.images?.map((imagePath: string, index: number) => ({
                    id: `portfolio-image-${index}`,
                    file: new File([], ''), // Dummy file for type compatibility
                    preview: getPortfolioImageUrl(portfolio.id, imagePath),
                    url: getPortfolioImageUrl(portfolio.id, imagePath),
                    uploaded: true,
                    isOptimizing: false
                })) || [];

                const newFormData = {
                    title: portfolio.title || '',
                    websiteUrl: portfolio.website_url?.replace(/^https?:\/\//, '') || '',
                    description: portfolio.description || '',
                    images: portfolioImages,
                    tools: portfolio.tools || [],
                    tags: portfolio.tags || [],
                    styles: portfolio.style?.map((styleName: string) => ({
                        id: styleName,
                        name: styleName,
                        display_name: styleName,
                        category: null
                    })) || []
                };

                setFormData(newFormData);
            }
        }
    }, [portfolio, isAdmin]);

    // Helper function to trigger save only if title exists
    const safeTriggerSave = (data: any) => {

        // Only trigger save if we have a title (required field)
        const hasTitle = formData.title.trim() || data.title?.trim();

        if (hasTitle) {
            // Always send all current form data plus the new changes
            const currentImageUrls = formData.images.filter(img => img.url).map(img => img.url);

            const completeData = {
                title: formData.title,
                websiteUrl: formData.websiteUrl,
                description: formData.description,
                tools: formData.tools,
                tags: formData.tags,
                styles: formData.styles,
                ...data, // Override with new changes first
                // Use data.images if provided, otherwise use current image URLs
                images: data.images || currentImageUrls
            };

            triggerSave(completeData);
        } else {
        }
    };

    // Auto-save hook
    const { triggerSave } = useAutoSave({
        debounceMs: 2000, // 2 seconds - good balance between responsiveness and efficiency
        savingText: 'Saving draft...',
        savedText: 'Draft saved',
        errorText: 'Failed to save draft'
    });

    // Load existing draft on mount
    useEffect(() => {
        const loadDraft = async () => {
            if (!user) return;

            try {
                const response = await fetch('/api/portfolios/draft');
                if (response.ok) {
                    const result = await response.json();
                    if (result.draft) {
                        // Process websiteUrl - remove https:// prefix if present
                        let processedWebsiteUrl = result.draft.website_url || '';
                        if (processedWebsiteUrl.startsWith('https://')) {
                            processedWebsiteUrl = processedWebsiteUrl.replace('https://', '');
                        }

                        setFormData(() => {
                            // Always load images from draft if available
                            const draftImages = result.draft.images ? result.draft.images
                                .filter((url: string | null) => url !== null && url !== '') // Filter out null/empty values
                                .map((imagePath: string, index: number) => {
                                    const fullImageUrl = getPortfolioImageUrl(result.draft.id, imagePath);
                                    return {
                                        id: `existing-${index}`,
                                        file: new File([], ''), // Placeholder file
                                        preview: fullImageUrl,
                                        uploaded: true,
                                        url: fullImageUrl
                                    };
                                }) : [];

                            return {
                                title: result.draft.title || '',
                                websiteUrl: processedWebsiteUrl,
                                description: result.draft.description || '',
                                images: draftImages,
                                tags: result.draft.tags || [],
                                tools: result.draft.tools || [],
                                styles: result.draft.styles || []
                            };
                        });

                        // Handle anchor scrolling after loading
                        setTimeout(() => {
                            const hash = window.location.hash;
                            if (hash) {
                                // If there's an anchor, scroll to it
                                const element = document.querySelector(hash);
                                if (element) {
                                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                }
                            }
                        }, 200);
                    }
                }
            } catch (error) {
                console.error('Error loading draft:', error);
            }
        };

        loadDraft();
    }, [user]);

    // Load available tools
    useEffect(() => {
        const loadTools = async () => {
            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('tools')
                    .select('*')
                    .order('name');

                if (error) {
                    console.error('Error loading tools:', error);
                    return;
                }

                setAvailableTools(data || []);
            } catch (error) {
                console.error('Error loading tools:', error);
            } finally {
                setIsLoadingTools(false);
            }
        };

        loadTools();
    }, []);

    // Load available styles
    useEffect(() => {
        const loadStyles = async () => {
            try {
                const supabase = createClient();
                const { data, error } = await supabase
                    .from('styles')
                    .select('*')
                    .order('display_name');

                if (error) {
                    console.error('Error loading styles:', error);
                    return;
                }

                setAvailableStyles(data || []);
            } catch (error) {
                console.error('Error loading styles:', error);
            } finally {
                setIsLoadingStyles(false);
            }
        };

        loadStyles();
    }, []);

    // Handle form submission
    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!formData.title.trim()) {
            toast.error('Please enter a project title');
            titleInputRef.current?.focus();
            return;
        }

        if (!formData.websiteUrl.trim()) {
            toast.error('Please enter a website URL');
            return;
        }

        // Check for valid images (with URLs)
        const hasValidImages = formData.images.some(img => img && (img.url || img.uploaded));
        if (!hasValidImages) {
            toast.error('Please upload at least one image');
            return;
        }

        setIsSubmitting(true);

        // Show uploading toast
        const uploadingToast = toast.loading('Uploading portfolio...');

        try {
            if (onSubmit) {
                await onSubmit(formData);

                // For admin users, always clear form after submit
                if (isAdmin) {
                    await handleClearAll();
                    toast.success('Portfolio submitted and form cleared for next upload!', { id: uploadingToast });
                    return;
                }

                // For normal users, refresh status to update UI immediately
                await refetch();
                toast.success('Portfolio submitted for review!', { id: uploadingToast });

                // Redirect to overview page
                router.push('/portfolio/overview');
            } else {
                // Default submission logic
                const imagesToSubmit = formData.images.map(img => img.url || img.preview);
                console.log('📤 Submitting images:', imagesToSubmit);
                
                const response = await fetch('/api/portfolios/upload', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        title: formData.title,
                        websiteUrl: formData.websiteUrl,
                        description: formData.description,
                        images: imagesToSubmit,
                        tools: formData.tools,
                        tags: formData.tags,
                        styles: formData.styles
                    }),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Upload failed');
                }

                toast.success('Portfolio submitted successfully!', { id: uploadingToast });
                router.push('/portfolio/overview');
            }
        } catch (error) {
            console.error('Error submitting portfolio:', error);
            toast.error(error instanceof Error ? error.message : 'Failed to submit portfolio', { id: uploadingToast });
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle preview
    const handlePreview = async () => {
        // If in read-only mode, preview the submitted portfolio instead of form data
        if (isReadOnly) {
            try {
                const response = await fetch('/api/portfolios/status');
                const result = await response.json();

                if (!response.ok || !result.portfolio) {
                    toast.error('Unable to load portfolio for preview');
                    return;
                }

                const portfolio = result.portfolio;

                // Validate that submitted portfolio has required data
                if (!portfolio.title || !portfolio.website_url || !portfolio.images?.length) {
                    toast.error('Portfolio data incomplete for preview');
                    return;
                }

                // Open the actual portfolio detail page (which will show the preview banner)
                const previewUrl = `/portfolios/${portfolio.id}`;
                window.open(previewUrl, '_blank');
                return;

            } catch (error) {
                console.error('Error loading portfolio for preview:', error);
                toast.error('Failed to load portfolio for preview');
                return;
            }
        }

        // Original validation for draft/editable mode
        if (!formData.title.trim()) {
            toast.error('Please enter a project title before previewing');
            titleInputRef.current?.focus();
            return;
        }

        if (!formData.websiteUrl.trim()) {
            toast.error('Please enter a website URL before previewing');
            return;
        }

        if (formData.images.length === 0) {
            toast.error('Please upload at least one image before previewing');
            return;
        }

        // Prepare draft data for preview
        const draftData = {
            title: formData.title,
            websiteUrl: formData.websiteUrl,
            description: formData.description,
            images: formData.images.map(img => img.url || img.preview),
            tools: formData.tools,
            tags: formData.tags,
            styles: formData.styles
        };


        try {
            const response = await fetch('/api/portfolios/draft', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(draftData)
            });

            const result = await response.json();

            if (result.success && result.draft?.id) {
                const previewUrl = `/${result.draft.id}`;
                window.open(previewUrl, '_blank');
            } else {
                throw new Error('Failed to create preview');
            }
        } catch (error) {
            console.error('Preview error:', error);
            toast.error('Failed to create preview');
        }
    };

    // Handle clear all
    const handleClearAll = async () => {
        try {
            // Clear form data
            setFormData({
                title: "",
                websiteUrl: "",
                description: "",
                images: [],
                tags: [],
                tools: [],
                styles: [],
            });

            // Clear any existing draft from database
            await fetch('/api/portfolios/draft/cleanup', {
                method: 'DELETE',
            });

            toast.success('All data cleared');
        } catch (error) {
            console.error('Error clearing form:', error);
            toast.error('Failed to clear form completely');
        }
    };

    // Handle image upload logic
    const handleImagesChange = async (images: PortfolioImage[]) => {
        if (isReadOnly) return;
        const imageUrls: string[] = [];
        const updatedImages: PortfolioImage[] = [];

        // Count new images to upload
        const newImages = images.filter(img => img.file && !img.uploaded);
        let uploadedCount = 0;

        for (const image of images) {
            if (image.file && !image.uploaded) {
                try {
                    // Show uploading toast for each image
                    uploadedCount++;
                    const uploadingToast = toast.loading(
                        newImages.length > 1
                            ? `Uploading image ${uploadedCount}/${newImages.length}...`
                            : 'Uploading image...'
                    );
                    // Convert File to base64
                    const reader = new FileReader();
                    const base64Promise = new Promise<string>((resolve) => {
                        reader.onload = () => resolve(reader.result as string);
                        reader.readAsDataURL(image.file);
                    });
                    const base64 = await base64Promise;

                    // Upload to server
                    const response = await fetch('/api/portfolios/images/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            file: base64,
                            fileName: image.file.name,
                            contentType: image.file.type
                        })
                    });

                    if (response.ok) {
                        const result = await response.json();
                        const imageUrl = result.url || result.imageUrl; // Support both formats

                        imageUrls.push(imageUrl);

                        // Create updated image with URL
                        const uploadedImage = {
                            ...image,
                            uploaded: true,
                            url: imageUrl
                        };
                        updatedImages.push(uploadedImage);

                        // Success toast
                        toast.success('Image uploaded successfully!', { id: uploadingToast });
                    } else {
                        console.error('Failed to upload image');
                        toast.error('Failed to upload image', { id: uploadingToast });
                        updatedImages.push(image); // Keep original image on error
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);
                    toast.error('Error uploading image');
                    updatedImages.push(image); // Keep original image on error
                }
            } else if (image.url) {
                // Image already uploaded, use existing URL
                imageUrls.push(image.url);
                updatedImages.push(image);
            } else {
                // Image without URL (shouldn't happen, but handle gracefully)
                updatedImages.push(image);
            }
        }

        // Update formData with processed images and save URLs to draft
        setFormData(prev => ({ ...prev, images: updatedImages }));

        // Force save with current title to ensure it triggers
        safeTriggerSave({
            images: imageUrls,
            title: formData.title // Ensure title is present for safeTriggerSave
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-10">
            {/* Image Upload Section */}
            <section aria-labelledby="images-heading">
                <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                    <div>
                        <h2
                            id="images-heading"
                            className="heading-section"
                        >
                            Portfolio Images
                        </h2>
                        <p className="text-small mt-2">
                            Upload up to 4 high-quality images that showcase your work. The first image will be used as the main thumbnail.
                        </p>
                        {isReadOnly && (
                            <StatusBadge status={status} published={published} isVisible={is_visible} />
                        )}
                    </div>
                    <div className={`md:col-span-2 md:pl-16 relative ${isReadOnly ? 'opacity-50 pointer-events-none' : ''}`}>
                        <ImageUploadSection
                            images={formData.images}
                            onImagesChange={handleImagesChange}
                            isReadOnly={isReadOnly || false}
                        />
                    </div>
                </div>
            </section>

            <Divider />

            {/* Basic Information Section */}
            <BasicInfoSection
                title={formData.title}
                websiteUrl={formData.websiteUrl}
                description={formData.description}
                onTitleChange={(title) => {
                    if (isReadOnly) return;
                    setFormData(prev => ({ ...prev, title }));
                    safeTriggerSave({ title });
                }}
                onWebsiteUrlChange={(websiteUrl) => {
                    if (isReadOnly) return;
                    // Always ensure https:// prefix for storage, but avoid double prefix
                    const cleanUrl = websiteUrl.replace(/^https?:\/\//, '');
                    const fullUrl = cleanUrl ? `https://${cleanUrl}` : '';
                    setFormData(prev => ({ ...prev, websiteUrl: fullUrl }));
                    safeTriggerSave({ websiteUrl: fullUrl });
                }}
                onDescriptionChange={(description) => {
                    if (isReadOnly) return;
                    setFormData(prev => ({ ...prev, description }));
                    safeTriggerSave({ description });
                }}
                titleInputRef={titleInputRef}
                isReadOnly={isReadOnly || false}
                status={status}
                published={published}
                isVisible={is_visible}
            />

            <Divider />

            {/* Tools Section */}
            <ToolsSection
                selectedTools={formData.tools}
                availableTools={availableTools}
                onToolsChange={(tools) => {
                    if (isReadOnly) return;
                    setFormData(prev => ({ ...prev, tools }));
                    safeTriggerSave({ tools });
                }}
                isLoading={isLoadingTools}
                isReadOnly={isReadOnly || false}
                status={status}
                published={published}
                isVisible={is_visible}
            />

            <Divider />

            {/* Styles Section */}
            <StyleSection
                selectedStyles={formData.styles}
                availableStyles={availableStyles}
                onStylesChange={(styles) => {
                    if (isReadOnly) return;
                    setFormData(prev => ({ ...prev, styles }));
                    safeTriggerSave({ styles });
                }}
                isLoading={isLoadingStyles}
                isReadOnly={isReadOnly || false}
                status={status}
                published={published}
                isVisible={is_visible}
            />

            <Divider />

            {/* Tags Section */}
            <TagsSection
                tags={formData.tags}
                onTagsChange={(tags) => {
                    if (isReadOnly) return;
                    setFormData(prev => ({ ...prev, tags }));
                    safeTriggerSave({ tags });
                }}
                isReadOnly={isReadOnly || false}
                status={status}
                published={published}
                isVisible={is_visible}
            />

            <Divider />

            {/* Upload Restrictions and Actions */}
            <UploadRestrictions
                user={user}
                onCanUpload={setCanUpload}
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                onPreview={handlePreview}
                onClearAll={handleClearAll}
                refreshTrigger={refreshTrigger}
                formData={formData}
                portfolioStatus={{
                    status,
                    canSubmit,
                    canPreview,
                    canClearAll,
                    canEdit,
                    showEditButton,
                    showWithdrawButton,
                    statusMessage,
                    isLoading: statusLoading
                }}
                onStatusChange={async () => {
                    await refetch();

                    // Wait a bit for the refetch to complete
                    setTimeout(() => {
                        // Force reload portfolio data after status change
                        if (portfolio && portfolio.images && (portfolio.images?.length || 0) > 0) {
                            const portfolioImages = portfolio.images?.map((imagePath: string, index: number) => {
                                const imageUrl = getPortfolioImageUrl(portfolio.id, imagePath);
                                return {
                                    id: `portfolio-image-${index}`,
                                    file: new File([], ''), // Dummy file for type compatibility
                                    preview: imageUrl,
                                    url: imageUrl,
                                    uploaded: true,
                                    isOptimizing: false
                                };
                            }) || [];

                            setFormData(prev => ({
                                ...prev,
                                images: portfolioImages
                            }));
                        }
                    }, 100);
                }}
            />
        </form>
    );
}