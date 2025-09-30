"use client";

import { Button } from "@/components/ui/Button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/Dialog";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { useAuth } from "@/hooks/shared/useAuth";
import { createClient } from "@/lib/supabase";
import { Mail } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function EmailSettings() {
    const { user } = useAuth();
    const supabase = createClient();
    const [emailFormData, setEmailFormData] = useState({
        newEmail: '',
        confirmEmail: ''
    });
    const [emailError, setEmailError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleEmailChange = (field: string, value: string) => {
        setEmailFormData(prev => ({ ...prev, [field]: value }));
        setEmailError(''); // Clear error when user types
    };

    const validateEmailForm = () => {
        if (!emailFormData.newEmail) {
            setEmailError('New email is required');
            return false;
        }
        // Use a more robust email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailFormData.newEmail)) {
            setEmailError('Please enter a valid email address');
            return false;
        }

        // Block test/example domains
        const testDomains = ['example.com', 'test.com', 'localhost', 'example.org', 'example.net'];
        const domain = emailFormData.newEmail.split('@')[1]?.toLowerCase();
        if (testDomains.includes(domain)) {
            setEmailError('Test domains like @example.com are not allowed. Please use a real email address.');
            return false;
        }
        if (!emailFormData.confirmEmail) {
            setEmailError('Please confirm your new email');
            return false;
        }
        if (emailFormData.newEmail !== emailFormData.confirmEmail) {
            setEmailError('Email addresses do not match');
            return false;
        }
        if (emailFormData.newEmail === user?.email) {
            setEmailError('New email must be different from current email');
            return false;
        }

        return true;
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateEmailForm()) {
            return;
        }

        // Early exit if user email is not available
        if (!user?.email) {
            setEmailError('User email not available. Please refresh the page.');
            return;
        }

        setIsLoading(true);
        setEmailError('');

        try {
            // Optional: Refresh session for fresh auth (no password needed)
            const { error: refreshError } = await supabase.auth.refreshSession();
            if (refreshError) {
                console.warn('Session refresh failed, continuing anyway:', refreshError);
            }

            // Update email address directly (no password verification needed)
            const { error: updateError } = await supabase.auth.updateUser({
                email: emailFormData.newEmail,
            });

            if (updateError) {
                // Provide better error messages for common issues
                let errorMessage = updateError.message;
                if (updateError.message.includes('is invalid') && emailFormData.newEmail.includes('@example.com')) {
                    errorMessage = 'Test domains like @example.com are not allowed. Please use a real email address.';
                } else if (updateError.message.includes('is invalid')) {
                    errorMessage = 'This email address is not allowed. Please use a different email address.';
                }

                setEmailError(errorMessage);
                setIsLoading(false);
                return;
            }

            // Immediately reset form and close dialog (no waiting for events)
            setEmailFormData({
                newEmail: '',
                confirmEmail: ''
            });
            setEmailError('');
            setIsLoading(false);
            setIsDialogOpen(false);

            // Show success message
            toast.success('Email update requested! Please check your new and old email for confirmation links.');

        } catch (error) {
            console.error('Error updating email:', error);
            setEmailError('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    // AuthContext now handles USER_UPDATED events, so we don&apos;t need this useEffect anymore


    return (
        <section aria-labelledby="email-settings-heading">
            <div>
                <div className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                        <div className="flex items-center gap-5">
                            <Mail size={17} className="flex-shrink-0 text-gray-400" />
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                    Email Address
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    {user?.email || 'No email set'}
                                </p>
                            </div>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="secondary">
                                    Change
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Change Email Address</DialogTitle>
                                    <DialogDescription>
                                        Enter your current password and new email address.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleEmailSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="new-email">New Email</Label>
                                        <Input
                                            type="email"
                                            id="new-email"
                                            value={emailFormData.newEmail}
                                            onChange={(e) => handleEmailChange('newEmail', e.target.value)}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="confirm-email">Confirm New Email</Label>
                                        <Input
                                            type="email"
                                            id="confirm-email"
                                            value={emailFormData.confirmEmail}
                                            onChange={(e) => handleEmailChange('confirmEmail', e.target.value)}
                                            className="mt-2"
                                        />
                                    </div>
                                    {emailError && (
                                        <div className="text-sm text-red-600 dark:text-red-400">
                                            {emailError}
                                        </div>
                                    )}
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button
                                                variant="secondary"
                                                disabled={isLoading}
                                            >
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="min-w-[120px]"
                                        >
                                            {isLoading ? 'Updating...' : 'Update Email'}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </section>
    );
}