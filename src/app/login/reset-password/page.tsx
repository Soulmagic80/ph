"use client";

import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Label } from "@/components/Label";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.onAuthStateChange(async (event) => {
      if (event === "PASSWORD_RECOVERY") {
        // Passwort-Reset-Modus
      }
    });
  }, []);

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setMessage("Password updated successfully!");
      setLoading(false);
      setTimeout(() => router.push("/login"), 2000); // Weiterleitung zur Login-Seite
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center p-4 sm:p-6">
      <div className="flex w-full flex-col items-center sm:max-w-sm">
        <div className="mt-6 flex flex-col">
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
  );
}