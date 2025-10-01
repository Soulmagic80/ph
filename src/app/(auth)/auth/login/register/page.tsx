"use client";

import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { createClient } from "@/lib/supabase";
import { RiGoogleFill } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const supabase = createClient();

// Password Policy Validierung
const validatePassword = (password: string): { isValid: boolean; message: string } => {
  const minLength = 8
  const hasUpperCase = /[A-Z]/.test(password)
  const hasLowerCase = /[a-z]/.test(password)
  const hasNumbers = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*]/.test(password)

  if (password.length < minLength) {
    return { isValid: false, message: `Password must be at least ${minLength} characters long` }
  }
  if (!hasUpperCase) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' }
  }
  if (!hasLowerCase) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' }
  }
  if (!hasNumbers) {
    return { isValid: false, message: 'Password must contain at least one number' }
  }
  if (!hasSpecialChar) {
    return { isValid: false, message: 'Password must contain at least one special character (!@#$%^&*)' }
  }

  return { isValid: true, message: '' }
}

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validiere Passwort
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.message);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: {
          full_name: email.split('@')[0], // Default to email username
          avatar_url: null
        }
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else if (data.user) {
      // Create profile with username and email
      const username = email.split('@')[0];
      const { error: profileError } = await (supabase as any)
        .from('profiles')
        .upsert({
          id: data.user.id,
          username: username,
          email: email,
          full_name: username,
          avatar_url: null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (profileError) {
        console.error('Error creating profile:', profileError);
      }

      toast.success("Account created successfully! Please check your email for confirmation.", {
        className: '!bg-emerald-50 !text-emerald-900 !border-emerald-500 [&>div]:!bg-emerald-50 [&>div]:!text-emerald-900 [&_.toast]:!bg-emerald-50 [&_.toast]:!text-emerald-900 [&_.toast]:!border-emerald-500'
      });
      router.push("/");
    }
  };

  const handleOAuthSignUp = async (provider: "github" | "google") => {
    setLoading(true);
    setError(null);

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
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

        <div className="flex flex-col text-center">
          <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
            Sign up for vibefolio
          </h1>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-500 hover:dark:text-blue-400"
            >
              Log in
            </Link>
          </p>
        </div>
        <div className="mt-10 w-full">
          <form onSubmit={handleSignUp} className="flex w-full flex-col gap-y-6">
            {error && (
              <div className="text-red-500 text-sm">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-y-4">
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
              <div className="flex flex-col space-y-2">
                <Label htmlFor="password-form-item" className="font-medium">
                  Password
                </Label>
                <Input
                  type="password"
                  autoComplete="new-password"
                  name="password"
                  id="password-form-item"
                  placeholder="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-500">
                  Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.
                </p>
              </div>
            </div>
            <Button type="submit" isLoading={loading}>
              {loading ? "" : "Sign Up"}
            </Button>
          </form>
          <Divider className="my-6">or</Divider>
          <div className="gap-2 sm:flex sm:flex-row sm:items-center">
            <Button
              variant="secondary"
              className="mt-2 w-full sm:mt-0"
              onClick={() => handleOAuthSignUp("google")}
              disabled={loading}
            >
              <span className="inline-flex items-center gap-2">
                <RiGoogleFill className="size-4" aria-hidden="true" />
                Sign up with Google
              </span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}