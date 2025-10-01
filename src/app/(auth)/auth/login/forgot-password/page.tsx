"use client";

import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { createClient } from "@/lib/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

const supabase = createClient();

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handlePasswordReset = async () => {
    if (!email) {
      setError("Please enter your email to reset your password.");
      return;
    }

    setLoading(true);
    setError(null);
    setMessage(null);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/login/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      setMessage("A password reset link has been sent to your email.");
      setLoading(false);
      setTimeout(() => router.push("/auth/login"), 2000);
    }
  };

  return (
    <div className="flex min-h-dvh items-center justify-center p-4 sm:p-6">
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

        <div className="w-full flex flex-col text-center">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Reset your password
          </h1>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
            We will send you an email to reset your password
          </p>
        </div>
        <div className="mt-10 w-full">
          <div className="flex flex-col gap-y-6">
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
            <div className="flex flex-col space-y-2">
              <Label htmlFor="email-form-item" className="font-medium">
                Email
              </Label>
              <Input
                type="email"
                autoComplete="email"
                name="email"
                id="email-form-item"
                placeholder="name@provider.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <Button onClick={handlePasswordReset} isLoading={loading}>
              {loading ? "" : "Email me"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}