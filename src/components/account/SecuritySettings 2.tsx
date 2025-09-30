"use client";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/shared/useAuth";
import { disableMFA, enableMFA, getMFAFactors, verifyMFASetup } from "@/lib/auth2FA";
import { AlertTriangle, QrCode, Shield, ShieldCheck, Smartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function SecuritySettings() {
    const { profile } = useAuth();
    const [step, setStep] = useState<'check' | 'setup' | 'verify' | 'complete'>('check');
    const [qrCode, setQrCode] = useState<string>('');
    const [secret, setSecret] = useState<string>('');
    const [factorId, setFactorId] = useState<string>('');
    const [verificationCode, setVerificationCode] = useState<string>('');
    const [isLoading, setIsLoading] = useState(false);
    const [hasMFA, setHasMFA] = useState(false);

    // Check current MFA status
    useEffect(() => {
        if (profile?.is_admin) {
            checkMFAStatus();
        }
    }, [profile?.is_admin]);

    // Only show for admins
    if (!profile?.is_admin) {
        return (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center">
                    <Shield className="h-5 w-5 text-gray-400 mr-3" />
                    <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Available for admin accounts only
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const checkMFAStatus = async () => {
        setIsLoading(true);
        const { factors } = await getMFAFactors();
        setHasMFA(factors.length > 0);
        setStep(factors.length > 0 ? 'complete' : 'setup');
        setIsLoading(false);
    };

    const handleEnableMFA = async () => {
        setIsLoading(true);
        const result = await enableMFA();

        if (result.error) {
            toast.error(`Failed to enable 2FA: ${result.error}`);
            setIsLoading(false);
            return;
        }

        console.log('MFA Result:', result);

        if (result.qrCode && result.secret && result.factorId) {
            setQrCode(result.qrCode);
            setSecret(result.secret);
            setFactorId(result.factorId);
            setStep('verify');
        } else {
            console.log('Missing data - qrCode:', !!result.qrCode, 'secret:', !!result.secret, 'factorId:', !!result.factorId);
            toast.error(`MFA setup incomplete - missing: ${!result.qrCode ? 'QR Code ' : ''}${!result.secret ? 'Secret ' : ''}${!result.factorId ? 'Factor ID' : ''}`);
        }

        setIsLoading(false);
    };

    const handleVerifySetup = async () => {
        if (!verificationCode || verificationCode.length !== 6) {
            toast.error('Please enter a valid 6-digit code');
            return;
        }

        setIsLoading(true);
        const result = await verifyMFASetup(factorId, verificationCode);

        if (result.success) {
            toast.success('2FA enabled successfully!');
            setStep('complete');
            setHasMFA(true);
        } else {
            toast.error(`Verification failed: ${result.error}`);
        }

        setIsLoading(false);
    };

    const handleDisableMFA = async () => {
        if (!confirm('Are you sure you want to disable 2FA? This will reduce your account security.')) {
            return;
        }

        setIsLoading(true);
        const { factors } = await getMFAFactors();

        if (factors.length > 0) {
            const result = await disableMFA(factors[0].id);

            if (result.success) {
                toast.success('2FA disabled successfully');
                setHasMFA(false);
                setStep('setup');
            } else {
                toast.error(`Failed to disable 2FA: ${result.error}`);
            }
        }

        setIsLoading(false);
    };

    if (isLoading && step === 'check') {
        return (
            <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6">
                <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            {/* Current Status */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center">
                    {hasMFA ? (
                        <ShieldCheck className="h-5 w-5 text-green-600 mr-3" />
                    ) : (
                        <Shield className="h-5 w-5 text-gray-400 mr-3" />
                    )}
                    <div>
                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            Two-Factor Authentication
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {hasMFA
                                ? 'Your account is secured with 2FA'
                                : 'Add an extra layer of security to your admin account'
                            }
                        </p>
                    </div>
                </div>
                {hasMFA && (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800 dark:bg-green-900/20 dark:text-green-400">
                        Enabled
                    </span>
                )}
            </div>

            {/* Setup Step */}
            {step === 'setup' && (
                <div className="space-y-4">
                    <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                        <div className="flex items-start">
                            <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 mt-0.5 mr-3 flex-shrink-0" />
                            <div>
                                <h4 className="font-medium text-yellow-800 dark:text-yellow-200">
                                    Recommended for Admin Accounts
                                </h4>
                                <p className="text-sm text-yellow-700 dark:text-yellow-300 mt-1">
                                    Enabling 2FA helps protect sensitive data and prevents unauthorized access to admin features.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="font-medium text-gray-900 dark:text-gray-100">What you&apos;ll need:</h4>
                        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                            <div className="flex items-center">
                                <Smartphone className="h-4 w-4 mr-2" />
                                An authenticator app (Google Authenticator, Authy, etc.)
                            </div>
                            <div className="flex items-center">
                                <QrCode className="h-4 w-4 mr-2" />
                                Ability to scan QR codes
                            </div>
                        </div>
                    </div>

                    <Button
                        onClick={handleEnableMFA}
                        disabled={isLoading}
                        className="w-full sm:w-auto"
                    >
                        {isLoading ? 'Setting up...' : 'Enable Two-Factor Authentication'}
                    </Button>
                </div>
            )}

            {/* Verify Step */}
            {step === 'verify' && (
                <div className="space-y-6">
                    <div>
                        <h4 className="font-medium text-gray-900 dark:text-gray-100 mb-4">
                            Scan QR Code with your Authenticator App
                        </h4>
                        {qrCode && (
                            <div className="flex justify-center mb-4">
                                <div className="p-4 bg-white rounded-lg border">
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: qrCode.replace('data:image/svg+xml;utf-8,', '')
                                        }}
                                        className="w-[200px] h-[200px]"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="text-sm text-gray-600 dark:text-gray-400 text-center">
                            <p className="mb-2">Can&apos;t scan? Enter this code manually:</p>
                            <code className="bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded text-xs break-all font-mono">
                                {secret}
                            </code>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Enter verification code from your app
                        </label>
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            placeholder="123456"
                            className="block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-center text-lg font-mono bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                            maxLength={6}
                        />
                    </div>

                    <div className="flex space-x-3">
                        <Button
                            variant="secondary"
                            onClick={() => setStep('setup')}
                            className="flex-1 sm:flex-none"
                        >
                            Back
                        </Button>
                        <Button
                            onClick={handleVerifySetup}
                            disabled={isLoading || verificationCode.length !== 6}
                            className="flex-1 sm:flex-none"
                        >
                            {isLoading ? 'Verifying...' : 'Verify & Enable'}
                        </Button>
                    </div>
                </div>
            )}

            {/* Complete Step */}
            {step === 'complete' && hasMFA && (
                <div className="space-y-4">
                    <Button
                        variant="secondary"
                        onClick={handleDisableMFA}
                        disabled={isLoading}
                        className="text-red-600 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-600 dark:hover:bg-red-900/20"
                    >
                        {isLoading ? 'Disabling...' : 'Disable Two-Factor Authentication'}
                    </Button>
                </div>
            )}
        </div>
    );
}

