"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { createClient } from "@/lib/supabase";
import { AuthChangeEvent } from "@supabase/supabase-js";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const supabase = createClient();

// Password Policy Validierung
const validatePassword = (password: string): { isValid: boolean; message: string } => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*]/.test(password);

  if (password.length < minLength) {
    return { isValid: false, message: `Password must be at least ${minLength} characters long` };
  }
  if (!hasUpperCase) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  if (!hasLowerCase) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  if (!hasNumbers) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  if (!hasSpecialChar) {
    return { isValid: false, message: 'Password must contain at least one special character (!@#$%^&*)' };
  }

  return { isValid: true, message: '' };
};

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/auth/login');
        return;
      }
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event: AuthChangeEvent) => {
      if (event === "PASSWORD_RECOVERY") {
        // Passwort-Reset-Modus
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    // Validiere Passwort
    const passwordValidation = validatePassword(newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setMessage("Password updated successfully!");
      setTimeout(() => router.push("/auth/login"), 2000);
    } catch (error: any) {
      setError(error.message || "An error occurred while updating your password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-dvh">
      {/* Left side - Form content */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-4 sm:p-6">
        <div className="flex w-full flex-col items-center sm:max-w-sm">
          {/* Logo */}
          <div className="mb-6">
            <Image
              src="/logolone.svg"
              alt="Vibefolio"
              width={120}
              height={40}
              className="h-8 w-auto"
            />
          </div>

          <div className="flex flex-col">
            <h1 className="text-lg font-semibold text-center text-gray-900 dark:text-gray-50">
              Change your password
            </h1>
            <p className="mt-1 text-sm text-gray-700 text-center dark:text-gray-300">
              Enter a new password
            </p>
          </div>
          <div className="mt-10 w-full">
            <form onSubmit={handleResetPassword} className="flex w-full flex-col gap-y-6">
              {error && (
                <div className="text-red-500 text-sm">
                  {error}
                </div>
              )}
              {message && (
                <div className="text-green-500 text-sm">
                  {message}
                </div>
              )}
              <div className="flex flex-col gap-y-4">
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="new-password-form-item" className="font-medium">
                    New Password
                  </Label>
                  <Input
                    type="password"
                    name="new-password"
                    id="new-password-form-item"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-gray-500">
                    Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <Label htmlFor="confirm-password-form-item" className="font-medium">
                    Confirm Password
                  </Label>
                  <Input
                    type="password"
                    name="confirm-password"
                    id="confirm-password-form-item"
                    placeholder="Confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>
              <Button type="submit" isLoading={loading}>
                {loading ? "" : "Change Password"}
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Right side - Pink background (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-pink-100 dark:bg-pinkdark-200 items-center justify-center p-12">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white leading-tight">
            Honest feedback.
            <br />
            Better portfolios.
            <br />
            Good vibes only.
          </h2>
        </div>
      </div>
    </div>
  );
}