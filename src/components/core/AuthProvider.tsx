"use client";
import { supabase } from "@/lib/supabase";
import { createContext, useEffect, useState } from "react";

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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsLoggedIn(!!session?.user);
        setUserEmail(session?.user?.email || "Unknown");
      } catch (error) {
        console.error('Error initializing auth:', error);
        setIsLoggedIn(false);
        setUserEmail("Unknown");
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setIsLoggedIn(!!session?.user);
      setUserEmail(session?.user?.email || "Unknown");
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (isLoading) {
    return null; // or a loading spinner
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, userEmail }}>
      {children}
    </AuthContext.Provider>
  );
}