"use client";

import AccountDeletion from "@/components/account/AccountDeletion";
import EmailSettings from "@/components/account/EmailSettings";
import PasswordSettings from "@/components/account/PasswordSettings";
import SecuritySettings from "@/components/account/SecuritySettings";
import { Divider } from "@/components/ui/Divider";
import { useAuth } from "@/hooks/shared/useAuth";

export default function Account() {
    const { profile } = useAuth();
    return (
        <div className="space-y-10">
            {/* Email Settings Section */}
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                <div>
                    <h2 className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50">
                        Email Settings
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Change your email address. You&apos;ll need to confirm your current password.
                    </p>
                </div>
                <div className="md:col-span-2 md:pl-24">
                    <EmailSettings />
                </div>
            </div>

            <Divider />

            {/* Password Settings Section */}
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                <div>
                    <h2 className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50">
                        Password Settings
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Update your password. You&apos;ll need to confirm your current password.
                    </p>
                </div>
                <div className="md:col-span-2 md:pl-24">
                    <PasswordSettings />
                </div>
            </div>

            {/* Security Settings Section - Only for Admins */}
            {profile?.is_admin && (
                <>
                    <Divider />
                    <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                        <div>
                            <h2 className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50">
                                Security Settings
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                Enable two-factor authentication to secure your admin account with an additional layer of protection.
                            </p>
                        </div>
                        <div className="md:col-span-2 md:pl-24">
                            <SecuritySettings />
                        </div>
                    </div>
                </>
            )}

            <Divider />

            {/* Account Deletion Section */}
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                <div>
                    <h2 className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50">
                        Account Deletion
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Permanently delete your account and all associated data. This action cannot be undone.
                    </p>
                </div>
                <div className="md:col-span-2 md:pl-24">
                    <AccountDeletion />
                </div>
            </div>
        </div>
    );
} 