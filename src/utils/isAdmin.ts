import { supabase } from "@/lib/supabase";

/**
 * Prüft, ob der gegebene User ein Admin ist.
 * @param userId Die User-ID (UUID)
 * @returns Promise<boolean> true, wenn Admin, sonst false
 */
export async function isAdmin(userId: string): Promise<boolean> {
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('is_admin')
    .eq('id', userId)
    .single();
  if (error || !profile) return false;
  return !!profile.is_admin;
} 