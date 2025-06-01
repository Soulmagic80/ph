import { Database } from "@/types/database.types";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createServerSupabaseClient = () => {
  const cookieStore = cookies();
  
  // Determine which environment to use
  const useStaging = process.env.NEXT_PUBLIC_USE_STAGING_DB === 'true';
  
  // Get the appropriate URL and key based on environment
  const supabaseUrl = useStaging 
    ? process.env.NEXT_PUBLIC_SUPABASE_STAGING_URL!
    : process.env.NEXT_PUBLIC_SUPABASE_URL!;
    
  const supabaseKey = useStaging 
    ? process.env.NEXT_PUBLIC_SUPABASE_STAGING_ANON_KEY!
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  
  return createServerClient<Database>(supabaseUrl, supabaseKey, {
    cookies: {
      async getAll() {
        return (await cookieStore).getAll();
      },
      async setAll(cookiesToSet) {
        try {
          const resolvedCookiesStore = await cookieStore;
          cookiesToSet.forEach(({ name, value, options }) =>
            resolvedCookiesStore.set(name, value, options)
          );
        } catch {
          // Handle errors if needed
        }
      }
    }
  });
};