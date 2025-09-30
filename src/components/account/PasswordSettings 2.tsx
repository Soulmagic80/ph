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
import { Shield } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function PasswordSettings() {
    const { user } = useAuth();
    const supabase = createClient();
    const [passwordFormData, setPasswordFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [passwordError, setPasswordError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handlePasswordChange = (field: string, value: string) => {
        setPasswordFormData(prev => ({ ...prev, [field]: value }));
        setPasswordError(''); // Clear error when user types
    };

    const validatePasswordForm = () => {
        if (!passwordFormData.currentPassword) {
            setPasswordError('Current password is required');
            return false;
        }
        if (!passwordFormData.newPassword) {
            setPasswordError('New password is required');
            return false;
        }
        if (passwordFormData.newPassword.length < 6) {
            setPasswordError('New password must be at least 6 characters long');
            return false;
        }
        if (!passwordFormData.confirmPassword) {
            setPasswordError('Please confirm your new password');
            return false;
        }
        if (passwordFormData.newPassword !== passwordFormData.confirmPassword) {
            setPasswordError('Passwords do not match');
            return false;
        }
        if (passwordFormData.currentPassword === passwordFormData.newPassword) {
            setPasswordError('New password must be different from current password');
            return false;
        }
        return true;
    };

    const handleOpenChange = (open: boolean) => {
        // Wenn das Modal geschlossen wird
        if (!open) {
            // Nur schließen wenn wir nicht gerade laden
            if (!isLoading) {
                setIsDialogOpen(false);
                // Form zurücksetzen
                setPasswordFormData({
                    currentPassword: '',
                    newPassword: '',
                    confirmPassword: ''
                });
                setPasswordError('');
            }
            // Wenn wir laden, das Modal NICHT schließen
        } else {
            // Modal öffnen
            setIsDialogOpen(true);
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validatePasswordForm()) return;

        setIsLoading(true);
        setPasswordError('');

        try {
            // First verify current password by attempting to sign in
            const { error: signInError } = await supabase.auth.signInWithPassword({
                email: user?.email || '',
                password: passwordFormData.currentPassword,
            });

            if (signInError) {
                setPasswordError('Current password is incorrect');
                setIsLoading(false);
                toast.error('Current password is incorrect. Please try again.');
                return;
            }

            // Update password
            const { error: updateError } = await supabase.auth.updateUser({
                password: passwordFormData.newPassword,
            });

            if (updateError) {
                setPasswordError(updateError.message);
                setIsLoading(false);
                toast.error('Failed to update password. Please try again.');
                return;
            }

            // Success - close dialog and reset form
            setIsLoading(false);
            setIsDialogOpen(false);
            setPasswordFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });

            // Show success toast
            toast.success('Password updated successfully!');

        } catch (error) {
            console.error('Error updating password:', error);
            setPasswordError('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <section aria-labelledby="security-heading">
            <div>
                <div className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                        <div className="flex items-center gap-5">
                            <Shield size={19} className="flex-shrink-0 text-gray-400" />
                            <div>
                                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                    Password
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Update your password to keep your account secure.
                                </p>
                            </div>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                            <DialogTrigger asChild>
                                <Button variant="secondary">
                                    Change
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Change Password</DialogTitle>
                                    <DialogDescription>
                                        Enter your current password and choose a new one.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                                    <div>
                                        <Label htmlFor="current-password">Current Password</Label>
                                        <Input
                                            type="password"
                                            id="current-password"
                                            value={passwordFormData.currentPassword}
                                            onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="new-password">New Password</Label>
                                        <Input
                                            type="password"
                                            id="new-password"
                                            value={passwordFormData.newPassword}
                                            onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                                            className="mt-2"
                                        />
                                    </div>
                                    <div>
                                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                                        <Input
                                            type="password"
                                            id="confirm-password"
                                            value={passwordFormData.confirmPassword}
                                            onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                                            className="mt-2"
                                        />
                                    </div>
                                    {passwordError && (
                                        <div className="text-sm text-red-600 dark:text-red-400">
                                            {passwordError}
                                        </div>
                                    )}
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button variant="secondary" disabled={isLoading}>
                                                Cancel
                                            </Button>
                                        </DialogClose>
                                        <Button
                                            type="submit"
                                            disabled={isLoading}
                                            className="min-w-[120px]"
                                        >
                                            {isLoading ? 'Updating...' : 'Update Password'}
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