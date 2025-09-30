"use client";

import React, { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        // Handle ChunkLoadError specifically
        if (error.name === 'ChunkLoadError' || error.message.includes('ChunkLoadError')) {
            console.log('🛠️ ErrorBoundary: ChunkLoadError detected, clearing cache and reloading');

            // Clear Supabase auth tokens
            if (typeof window !== 'undefined') {
                localStorage.removeItem('supabase.auth.token');
                localStorage.removeItem('supabase.auth.refresh_token');
                console.log('🧹 ErrorBoundary: Cleared localStorage auth tokens');
            }

            // Force page reload after a short delay
            setTimeout(() => {
                window.location.reload();
            }, 1000);

            return { hasError: true, error };
        }

        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('💥 ErrorBoundary: Error caught:', error);
        console.error('💥 ErrorBoundary: Error info:', errorInfo);

        // Handle ChunkLoadError specifically
        if (error.name === 'ChunkLoadError' || error.message.includes('ChunkLoadError')) {
            console.log('🛠️ ErrorBoundary: ChunkLoadError in componentDidCatch, clearing cache');

            // Clear Supabase auth tokens
            if (typeof window !== 'undefined') {
                localStorage.removeItem('supabase.auth.token');
                localStorage.removeItem('supabase.auth.refresh_token');
                console.log('🧹 ErrorBoundary: Cleared localStorage auth tokens');
            }
        }
    }

    render() {
        if (this.state.hasError) {
            // Check if it's a ChunkLoadError
            const isChunkError = this.state.error?.name === 'ChunkLoadError' ||
                this.state.error?.message.includes('ChunkLoadError');

            if (isChunkError) {
                return (
                    <div className="min-h-screen flex items-center justify-center bg-gray-50">
                        <div className="text-center p-8">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                Loading...
                            </h2>
                            <p className="text-gray-600">
                                Clearing cache and reloading...
                            </p>
                        </div>
                    </div>
                );
            }

            // For other errors, show fallback or default error UI
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-gray-50">
                    <div className="text-center p-8">
                        <h2 className="text-xl font-semibold text-gray-900 mb-2">
                            Something went wrong
                        </h2>
                        <p className="text-gray-600 mb-4">
                            An unexpected error occurred. Please try refreshing the page.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                            Refresh Page
                        </button>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}

// Global error handler for ChunkLoadError
if (typeof window !== 'undefined') {
    // Handle unhandled errors
    window.addEventListener('error', (event: ErrorEvent) => {
        if (event.message.includes('ChunkLoadError')) {
            console.log('🛠️ Global Error Handler: ChunkLoadError detected, clearing cache and reloading');

            // Clear Supabase auth tokens
            localStorage.removeItem('supabase.auth.token');
            localStorage.removeItem('supabase.auth.refresh_token');
            console.log('🧹 Global Error Handler: Cleared localStorage auth tokens');

            // Force page reload
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    });

    // Handle unhandled promise rejections
    window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
        if (event.reason && event.reason.message && event.reason.message.includes('ChunkLoadError')) {
            console.log('🛠️ Global Promise Handler: ChunkLoadError detected, clearing cache and reloading');

            // Clear Supabase auth tokens
            localStorage.removeItem('supabase.auth.token');
            localStorage.removeItem('supabase.auth.refresh_token');
            console.log('🧹 Global Promise Handler: Cleared localStorage auth tokens');

            // Force page reload
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    });
} 