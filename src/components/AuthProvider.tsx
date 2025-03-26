"use client";
import { createContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

// Erstelle den AuthContext
export const AuthContext = createContext<{
  isLoggedIn: boolean;
  userEmail: string;
}>({
  isLoggedIn: false,
  userEmail: "Unknown",
});

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
    <AuthContext.Provider value={{ isLoggedIn, userEmail }}>
      {children}
    </AuthContext.Provider>
  );
}