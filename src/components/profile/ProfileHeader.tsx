"use client";

import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { createClient } from "@/lib/supabase";
import { Trash2, Upload } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { toast } from "sonner";

interface ProfileHeaderProps {
    fullName: string;
    location: string;
    avatarUrl?: string;
    onFullNameChange: (fullName: string) => void;
    onLocationChange: (location: string) => void;
    onAvatarChange: (avatarUrl: string) => void;
}

export default function ProfileHeader({
    fullName,
    location,
    avatarUrl,
    onFullNameChange,
    onLocationChange,
    onAvatarChange
}: ProfileHeaderProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isUploading, setIsUploading] = useState(false);
    const supabase = createClient();

    const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        // Validate file type and size
        const allowedTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            toast.error('Please select a PNG, JPG, GIF or WebP image');
            return;
        }

        if (file.size > 2 * 1024 * 1024) { // 2MB limit
            toast.error('File size must be less than 2MB');
            return;
        }

        setIsUploading(true);

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            // Generate unique filename
            const fileExt = file.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;

            // Upload to Supabase Storage
            const { error: uploadError } = await supabase.storage
                .from('avatars')
                .upload(fileName, file, {
                    cacheControl: '3600',
                    upsert: false
                });

            if (uploadError) {
                throw uploadError;
            }

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('avatars')
                .getPublicUrl(fileName);

            // Update profile in database
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    avatar_url: publicUrl,
                    updated_at: new Date().toISOString()
                });

            if (updateError) {
                throw updateError;
            }

            // Update local state
            onAvatarChange(publicUrl);
            toast.success('Avatar updated successfully!');

        } catch (error) {
            console.error('Error uploading avatar:', error);
            toast.error('Failed to upload avatar. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleAvatarDelete = async () => {
        if (!avatarUrl) return;

        try {
            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                throw new Error('User not authenticated');
            }

            // Extract filename from URL
            const urlParts = avatarUrl.split('/');
            const fileName = urlParts[urlParts.length - 1];

            // Delete from storage
            const { error: deleteError } = await supabase.storage
                .from('avatars')
                .remove([fileName]);

            if (deleteError) {
                console.warn('Failed to delete from storage:', deleteError);
            }

            // Update profile in database
            const { error: updateError } = await supabase
                .from('profiles')
                .upsert({
                    id: user.id,
                    avatar_url: null,
                    updated_at: new Date().toISOString()
                });

            if (updateError) {
                throw updateError;
            }

            // Update local state
            onAvatarChange("");
            toast.success('Avatar removed successfully!');

        } catch (error) {
            console.error('Error deleting avatar:', error);
            toast.error('Failed to delete avatar. Please try again.');
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    return (
        <section aria-labelledby="profile-header-heading">
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                <div>
                    <h2
                        id="profile-header-heading"
                        className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
                    >
                        Profile Information
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Update your profile picture and basic information.
                    </p>
                </div>
                <div className="md:col-span-2 md:pl-24">
                    <div className="space-y-6">
                        {/* Avatar Section - Full Row */}
                        <div className="flex items-center gap-4">
                            <Avatar className="w-12 h-12">
                                {avatarUrl ? (
                                    <Image
                                        src={avatarUrl}
                                        alt="Profile"
                                        fill
                                        className="object-cover rounded-full"
                                        onError={() => onAvatarChange("")}
                                    />
                                ) : (
                                    <div className="w-12 h-12 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-800 rounded-full flex items-center justify-center">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {fullName.charAt(0).toUpperCase() || "U"}
                                        </span>
                                    </div>
                                )}
                            </Avatar>
                            <div className="flex items-end gap-3">
                                <Button
                                    variant="secondary"
                                    onClick={triggerFileInput}
                                    disabled={isUploading}
                                    className="flex items-center gap-2"
                                >
                                    <Upload className="h-4 w-4" />
                                    {isUploading ? 'Uploading...' : 'Change'}
                                </Button>
                                {!avatarUrl && (
                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-tight">
                                        PNG, JPG, GIF or WebP<br />
                                        Maximum 2MB
                                    </p>
                                )}
                                {avatarUrl && (
                                    <Button
                                        variant="secondary"
                                        onClick={handleAvatarDelete}
                                        disabled={isUploading}
                                        className="flex items-center gap-2 text-red-600 hover:text-red-700"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Remove
                                    </Button>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/gif,image/webp"
                                onChange={handleAvatarUpload}
                                className="hidden"
                            />
                        </div>

                        {/* Name and Location Fields */}
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="full-name" className="font-medium">
                                    Full Name
                                </Label>
                                <Input
                                    type="text"
                                    id="full-name"
                                    value={fullName}
                                    onChange={(e) => onFullNameChange(e.target.value)}
                                    placeholder="Enter your full name"
                                    className="mt-2"
                                />
                            </div>
                            <div>
                                <Label htmlFor="location" className="font-medium">
                                    Location
                                </Label>
                                <Input
                                    type="text"
                                    id="location"
                                    value={location}
                                    onChange={(e) => onLocationChange(e.target.value)}
                                    placeholder="City, Country"
                                    className="mt-2"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}