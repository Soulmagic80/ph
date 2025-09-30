"use client";

import { Button } from "@/components/ui/Button";
import { createMFAChallenge, verifyMFAChallenge } from "@/lib/auth2FA";
import { AlertCircle, Shield } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface MFAPromptProps {
    factorId: string;
    onSuccess: () => void;
    onCancel?: () => void;
    title?: string;
    description?: string;
}

export default function MFAPrompt({
    factorId,
    onSuccess,
    onCancel,
    title = "Admin Verification Required",
    description = "Please enter your 2FA code to access admin features"
}: MFAPromptProps) {
    const [challengeId, setChallengeId] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string>('');

    // console.log('🔑 MFAPrompt received factorId:', factorId);

    // Create challenge on mount
    useEffect(() => {
        if (factorId && !challengeId) {
            createChallenge();
        } else if (!factorId) {
            setError('No factor ID provided');
        }
    }, [factorId, challengeId]);

    const createChallenge = async () => {
        if (!factorId) {
            setError('No factor ID available');
            return;
        }

        const result = await createMFAChallenge(factorId);

        if (result.error) {
            setError(result.error);
            toast.error('Failed to create verification challenge');
            return;
        }

        if (result.challenge) {
            setChallengeId(result.challenge.id);
        } else {
            setError('No challenge created');
        }
    };

    const handleVerify = async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            setError('Please enter a valid 6-digit code');
            return;
        }

        if (!challengeId) {
            setError('No verification challenge available');
            return;
        }

        setIsLoading(true);
        setError('');

        const result = await verifyMFAChallenge(challengeId, verificationCode, factorId);

        if (result.success) {
            toast.success('Verification successful!');
            onSuccess();
        } else {
            setError(result.error || 'Verification failed');
            toast.error('Invalid verification code');
            // Clear the code for retry
            setVerificationCode('');
        }

        setIsLoading(false);
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && verificationCode.length === 6) {
            handleVerify();
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full mx-4 border shadow-xl">
                {/* Header */}
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        <Shield className="h-12 w-12 text-blue-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        {description}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                        <div className="flex items-center">
                            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400 mr-2" />
                            <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                        </div>
                    </div>
                )}

                {/* Verification Code Input */}
                <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Enter 6-digit code from your authenticator app
                    </label>
                    <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => {
                            setError(''); // Clear error on input
                            setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6));
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="123456"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-md text-center text-xl font-mono tracking-wider bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        maxLength={6}
                        autoFocus
                        disabled={isLoading}
                    />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-3">
                    {onCancel && (
                        <Button
                            variant="secondary"
                            onClick={onCancel}
                            disabled={isLoading}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                    )}
                    <Button
                        onClick={handleVerify}
                        disabled={isLoading || verificationCode.length !== 6}
                        className="flex-1"
                    >
                        {isLoading ? 'Verifying...' : 'Verify'}
                    </Button>
                </div>

                {/* Help Text */}
                <div className="mt-4 text-center">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Can&apos;t access your authenticator app?{' '}
                        <button
                            onClick={onCancel}
                            className="text-blue-600 dark:text-blue-400 hover:underline"
                        >
                            Contact support
                        </button>
                    </p>
                </div>
            </div>
        </div>
    );
}

