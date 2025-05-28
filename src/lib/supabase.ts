import { Database } from "@/types/database.types";
import { createClient } from "@supabase/supabase-js";

// Get the URL and key
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase URL und Key müssen definiert sein!");
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);