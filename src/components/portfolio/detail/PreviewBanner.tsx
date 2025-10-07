"use client";

import { Eye, X } from "lucide-react";

interface PreviewBannerProps {
    isVisible: boolean;
}

export function PreviewBanner({ isVisible }: PreviewBannerProps) {
    if (!isVisible) return null;

    return (
        <div 
            className="text-white" 
            style={{ 
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 100,
                backgroundColor: '#FF006A', 
                height: '64px', 
                display: 'flex', 
                alignItems: 'center' 
            }}
        >
            <div className="max-w-7xl mx-auto px-5 md:px-10 w-full">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <Eye className="h-5 w-5" />
                        <div>
                            <span className="font-medium">Preview Mode</span>
                            <span className="ml-2 text-gray-200 dark:text-gray-200">
                                This is how your portfolio will look to visitors
                            </span>
                        </div>
                    </div>
                    <div className="flex items-center">
                        <button
                            className="px-4 py-2 rounded-md text-white hover:bg-white/20 transition-colors flex items-center gap-2"
                            onClick={() => window.close()}
                        >
                            <X className="h-4 w-4" />
                            Close Preview
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

