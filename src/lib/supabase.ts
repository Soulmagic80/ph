import { Database } from "@/types/supabase";
import { createBrowserClient } from '@supabase/ssr';

export const createClient = () => {
  // Determine which environment to use
  const useStaging = process.env.NEXT_PUBLIC_USE_STAGING_DB === 'true';
  
  // Get the appropriate URL and key based on environment
  const supabaseUrl = useStaging 
    ? process.env.NEXT_PUBLIC_SUPABASE_STAGING_URL!
    : process.env.NEXT_PUBLIC_SUPABASE_URL!;

  const supabaseKey = useStaging 
    ? process.env.NEXT_PUBLIC_SUPABASE_STAGING_ANON_KEY!
    : process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  return createBrowserClient<Database>(supabaseUrl, supabaseKey);
} 