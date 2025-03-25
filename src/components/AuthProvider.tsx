"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function AuthProvider({ children, initialIsLoggedIn, initialUserEmail }: { children: React.ReactNode; initialIsLoggedIn: boolean; initialUserEmail: string }) {
  const [isLoggedIn, setIsLoggedIn] = useState(initialIsLoggedIn);
  const [userEmail, setUserEmail] = useState(initialUserEmail);

  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session?.user);
      setUserEmail(session?.user?.email || "Unknown");
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  return (
    <div data-is-logged-in={isLoggedIn} data-user-email={userEmail}>
      {children}
    </div>
  );
}