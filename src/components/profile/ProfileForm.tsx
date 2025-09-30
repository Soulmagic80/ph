"use client";

import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";

interface ProfileFormProps {
    website: string;
    bio: string;
    onWebsiteChange: (website: string) => void;
    onBioChange: (bio: string) => void;
}

export default function ProfileForm({
    website,
    bio,
    onWebsiteChange,
    onBioChange
}: ProfileFormProps) {
    return (
        <section aria-labelledby="profile-form-heading">
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                <div>
                    <h2
                        id="profile-form-heading"
                        className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
                    >
                        Profile Details
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Add more information to your profile.
                    </p>
                </div>
                <div className="md:col-span-2 md:pl-24">
                    <div className="space-y-6">
                        <div>
                            <Label htmlFor="website" className="font-medium">
                                Website
                            </Label>
                            <div className="mt-2 flex rounded-md border border-gray-300 dark:border-gray-800 shadow-sm focus-within:ring-2 focus-within:ring-blue-500 focus-within:dark:ring-blue-400 focus-within:border-blue-500 focus-within:dark:border-blue-400 transition-all">
                                <span className="inline-flex items-center px-2.5 bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 sm:text-sm border-r border-gray-300 dark:border-gray-800 rounded-l-md">
                                    https://
                                </span>
                                <input
                                    type="text"
                                    id="website"
                                    value={website?.replace(/^https?:\/\//, '') || ''}
                                    onChange={(e) => onWebsiteChange(e.target.value)}
                                    placeholder="yourwebsite.com"
                                    className="flex-1 bg-white dark:bg-gray-950 border-0 outline-none focus:ring-0 focus:outline-none px-2.5 py-2 sm:text-sm text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 rounded-r-md"
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="bio" className="font-medium">
                                Bio
                            </Label>
                            <Textarea
                                id="bio"
                                value={bio}
                                onChange={(e) => onBioChange(e.target.value)}
                                placeholder="Tell us about yourself..."
                                rows={4}
                                className="mt-2"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}