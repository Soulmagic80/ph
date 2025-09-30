"use client";

import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/Textarea";
import { Clock } from "lucide-react";

interface BasicInfoSectionProps {
    title: string;
    websiteUrl: string;
    description: string;
    onTitleChange: (title: string) => void;
    onWebsiteUrlChange: (url: string) => void;
    onDescriptionChange: (description: string) => void;
    titleInputRef?: React.RefObject<HTMLInputElement>;
    isReadOnly?: boolean;
}

export default function BasicInfoSection({
    title,
    websiteUrl,
    description,
    onTitleChange,
    onWebsiteUrlChange,
    onDescriptionChange,
    titleInputRef,
    isReadOnly = false
}: BasicInfoSectionProps) {

    return (
        <section aria-labelledby="basic-info-heading">
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                <div>
                    <h2
                        id="basic-info-heading"
                        className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
                    >
                        Basic Information
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Provide basic information about your portfolio project.
                    </p>
                    {isReadOnly && (
                        <div className="inline-flex items-center px-2 py-1 mt-3 rounded text-xs font-medium bg-orange-50 text-orange-900 ring-1 ring-orange-500/30 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/30">
                            <Clock className="w-3 h-3 mr-1.5" />
                            PENDING APPROVAL
                        </div>
                    )}
                </div>
                <div className="md:col-span-2 md:pl-16 relative">
                    {isReadOnly && (
                        <div className="absolute inset-0 bg-white/90 dark:bg-gray-950/70 z-10 rounded-lg"></div>
                    )}
                    <div className="space-y-6">
                        {/* Title */}
                        <div>
                            <Label htmlFor="title" className="block text-sm font-medium text-gray-900 dark:text-gray-50">
                                Project Title *
                            </Label>
                            <div className="mt-2">
                                <Input
                                    ref={titleInputRef}
                                    type="text"
                                    name="title"
                                    id="title"
                                    value={title}
                                    onChange={(e) => onTitleChange(e.target.value)}
                                    placeholder="Enter your project title"
                                    className="block w-full"
                                    readOnly={isReadOnly}
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>

                        {/* Website URL */}
                        <div>
                            <Label htmlFor="websiteUrl" className="block text-sm font-medium text-gray-900 dark:text-gray-50">
                                Website URL *
                            </Label>
                            <div className="mt-2 flex rounded-md border border-gray-300 dark:border-gray-800 shadow-sm bg-white dark:bg-gray-950 focus-within:ring-2 focus-within:ring-blue-500 focus-within:dark:ring-blue-400 focus-within:border-blue-500 focus-within:dark:border-blue-400 transition-all">
                                <span className="inline-flex items-center px-2.5 bg-gray-50 dark:bg-gray-950 text-gray-500 dark:text-gray-400 sm:text-sm border-r border-gray-300 dark:border-gray-800 rounded-l-md">
                                    https://
                                </span>
                                <input
                                    type="text"
                                    id="websiteUrl"
                                    value={websiteUrl?.replace(/^https?:\/\//, '') || ''}
                                    onChange={(e) => onWebsiteUrlChange(e.target.value)}
                                    placeholder="your-project.com"
                                    className="flex-1 bg-transparent border-0 outline-none focus:ring-0 focus:outline-none px-2.5 py-2 sm:text-sm text-gray-900 dark:text-gray-50 placeholder-gray-400 dark:placeholder-gray-500 rounded-r-md"
                                    readOnly={isReadOnly}
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>

                        {/* Description */}
                        <div>
                            <Label htmlFor="description" className="block text-sm font-medium text-gray-900 dark:text-gray-50">
                                Description
                            </Label>
                            <div className="mt-2">
                                <Textarea
                                    name="description"
                                    id="description"
                                    rows={4}
                                    value={description}
                                    onChange={(e) => onDescriptionChange(e.target.value)}
                                    placeholder="Describe your project, the technologies used, and what makes it special..."
                                    className="block w-full"
                                    readOnly={isReadOnly}
                                    disabled={isReadOnly}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
