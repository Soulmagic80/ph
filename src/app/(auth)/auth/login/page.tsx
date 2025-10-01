"use client"

import MFAPrompt from "@/components/auth/MFAPrompt";
import { Button } from "@/components/ui/Button";
import { Divider } from "@/components/ui/Divider";
import { Input } from "@/components/ui/Input";
import { Label } from "@/components/ui/Label";
import { requiresAdminMFA } from "@/lib/auth2FA";
import { createClient } from "@/lib/supabase";
import { RiGoogleFill } from "@remixicon/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { Suspense, useState } from "react";

const supabase = createClient();

// Separate component that uses useSearchParams
function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [showMFA, setShowMFA] = useState(false)
  const [mfaFactorId, setMfaFactorId] = useState<string>("")
  const router = useRouter()
  const searchParams = useSearchParams()
  if (!searchParams) {
    throw new Error('Search params not available')
  }

  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    // Check if user is admin and needs MFA
    try {
      const { required, factorId } = await requiresAdminMFA()

      if (required && factorId) {
        // Admin user needs MFA verification
        setMfaFactorId(factorId)
        setShowMFA(true)
        setLoading(false)
      } else {
        // Regular user or admin without MFA - proceed normally
        const redirectTo = searchParams.get("redirectedFrom") || "/"
        router.push(redirectTo)
        router.refresh()
      }
    } catch (mfaError) {
      console.error('MFA check failed:', mfaError)
      // Proceed without MFA on error
      const redirectTo = searchParams.get("redirectedFrom") || "/"
      router.push(redirectTo)
      router.refresh()
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError(null)

    const redirectTo = searchParams.get("redirectedFrom") || "/"
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirectedFrom=${encodeURIComponent(redirectTo)}`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      },
    })

    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  const handleMFASuccess = () => {
    const redirectTo = searchParams.get("redirectedFrom") || "/"
    router.push(redirectTo)
    router.refresh()
  }

  const handleMFACancel = () => {
    setShowMFA(false)
    setMfaFactorId("")
    // Optionally sign out the user
    supabase.auth.signOut()
  }

  // Show MFA prompt if required
  if (showMFA && mfaFactorId) {
    return (
      <MFAPrompt
        factorId={mfaFactorId}
        onSuccess={handleMFASuccess}
        onCancel={handleMFACancel}
        title="Admin Login Verification"
        description="Please enter your 2FA code to complete admin login"
      />
    )
  }

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
            Log in to vibefolio
          </h1>
          <p className="mt-1 text-sm text-gray-700 dark:text-gray-300">
            Don&apos;t have an account?{" "}
            <Link
              href="/auth/login/register"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-500 hover:dark:text-blue-400"
            >
              Sign up
            </Link>
          </p>
        </div>
        <div className="mt-10 w-full">
          <form onSubmit={handleEmailLogin} className="flex w-full flex-col gap-y-6">
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
                  autoComplete="current-password"
                  name="password"
                  id="password-form-item"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
            <Button type="submit" isLoading={loading}>
              {loading ? "" : "Continue"}
            </Button>
          </form>
          <Divider className="my-6">or</Divider>
          <div className="gap-2 sm:flex sm:flex-row sm:items-center">
            <Button
              variant="secondary"
              className="mt-2 w-full sm:mt-0"
              onClick={handleGoogleLogin}
              disabled={loading}
            >
              <span className="inline-flex items-center gap-2">
                <RiGoogleFill className="size-4" aria-hidden="true" />
                Login with Google
              </span>
            </Button>
          </div>
        </div>
        <Divider />
        <p className="text-sm text-gray-700 dark:text-gray-300">
          Forgot your password?{" "}
          <Link
            href="/auth/login/forgot-password"
            className="text-blue-500 hover:text-blue-600 dark:text-blue-500 hover:dark:text-blue-400"
          >
            Reset password
          </Link>
        </p>
      </div>
    </div>
  )
}

// Main component with Suspense boundary
export default function Login() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm />
    </Suspense>
  )
}