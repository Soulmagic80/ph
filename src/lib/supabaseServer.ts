import { Database } from "@/types/supabase";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export const createServerSupabaseClient = async () => {
  const cookieStore = await cookies();
  
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
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookieStore.set(name, value, options)
        );
      }
    }
  });
};