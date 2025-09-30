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
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function AccountDeletion() {
    const { signOut } = useAuth();
    const supabase = createClient();
    const router = useRouter();
    const [confirmationText, setConfirmationText] = useState('');
    const [deletionError, setDeletionError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleOpenChange = (open: boolean) => {
        // Wenn das Modal geschlossen wird
        if (!open) {
            // Nur schließen wenn wir nicht gerade laden
            if (!isLoading) {
                setIsDialogOpen(false);
                resetForm();
            }
            // Wenn wir laden, das Modal NICHT schließen
        } else {
            // Modal öffnen
            setIsDialogOpen(true);
        }
    };

    const handleDeleteAccount = async () => {
        if (confirmationText !== 'DELETE') {
            setDeletionError('Please type "DELETE" to confirm account deletion');
            return;
        }

        setIsLoading(true);
        setDeletionError('');

        try {
            // First check if user is authenticated
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            console.log('Current user:', currentUser?.id);

            if (!currentUser) {
                setDeletionError('You must be logged in to delete your account');
                setIsLoading(false);
                return;
            }

            // Call the delete_user_account function
            const { data, error } = await (supabase.rpc as any)('delete_user_account');

            console.log('Delete account response:', { data, error });

            if (error) {
                console.error('Error deleting account:', error);
                // More detailed error message
                if (error.code === '42883') {
                    setDeletionError('Delete function not found. Please contact support.');
                } else if (error.code === '42501') {
                    setDeletionError('Permission denied. Please contact support.');
                } else {
                    setDeletionError(`Failed to delete account: ${error.message || JSON.stringify(error)}`);
                }
                setIsLoading(false);
                return;
            }

            // Success - close dialog and reset form
            setIsLoading(false);
            setIsDialogOpen(false);
            resetForm();

            // Sign out the user
            await signOut();

            // Redirect to homepage
            router.push('/');

            // Show success toast
            toast.success('Your account has been successfully deleted.');

        } catch (error) {
            console.error('Error deleting account:', error);
            setDeletionError('An unexpected error occurred. Please try again.');
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setConfirmationText('');
        setDeletionError('');
        setIsLoading(false);
    };

    return (
        <section aria-labelledby="account-deletion-heading">
            <div>
                <div className="space-y-6">
                    <div className="flex items-center justify-between rounded-lg border border-red-200 p-4 dark:border-red-800">
                        <div className="flex items-center gap-5">
                            <Trash2 size={19} className="flex-shrink-0 text-red-400" />
                            <div>
                                <h3 className="text-sm font-medium text-red-900 dark:text-red-50">
                                    Delete Account
                                </h3>
                                <p className="mt-1 text-sm text-red-500 pr-4">
                                    All your data will be permanently deleted.
                                </p>
                            </div>
                        </div>
                        <Dialog open={isDialogOpen} onOpenChange={handleOpenChange}>
                            <DialogTrigger asChild>
                                <Button variant="destructive">
                                    Delete
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Delete Account</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. All your portfolios, comments, ratings, and profile data will be permanently deleted.
                                    </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                                        <p className="text-sm text-red-700 dark:text-red-300 font-medium">
                                            Warning: This will permanently delete:
                                        </p>
                                        <ul className="text-sm text-red-600 dark:text-red-400 mt-2 list-disc list-inside space-y-1">
                                            <li>Your profile and account</li>
                                            <li>All your portfolios</li>
                                            <li>All your comments and ratings</li>
                                            <li>All associated files and data</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <Label htmlFor="confirmation-text">
                                            Type <strong>DELETE</strong> to confirm:
                                        </Label>
                                        <Input
                                            id="confirmation-text"
                                            value={confirmationText}
                                            onChange={(e) => {
                                                setConfirmationText(e.target.value);
                                                setDeletionError('');
                                            }}
                                            placeholder="Type DELETE here"
                                            className="mt-2"
                                        />
                                    </div>
                                    {deletionError && (
                                        <div className="text-sm text-red-600 dark:text-red-400">
                                            {deletionError}
                                        </div>
                                    )}
                                </div>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button variant="secondary" disabled={isLoading}>
                                            Cancel
                                        </Button>
                                    </DialogClose>
                                    <Button
                                        variant="destructive"
                                        onClick={handleDeleteAccount}
                                        disabled={isLoading || confirmationText !== 'DELETE'}
                                    >
                                        {isLoading ? 'Deleting...' : 'Delete Account'}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                </div>
            </div>
        </section>
    );
}