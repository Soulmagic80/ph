import { Database } from '@/types/supabase'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export const createServerSupabaseClient = () => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookies()).getAll()
        },
        async setAll(cookiesToSet) {
          const cookieStore = await cookies()
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set({ name, value, ...options })
          )
        }
      },
    }
  )
}

// Create a server client with service_role permissions for accessing materialized views
export const createServerSupabaseAdminClient = () => {
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookies()).getAll()
        },
        async setAll(cookiesToSet) {
          const cookieStore = await cookies()
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set({ name, value, ...options })
          )
        }
      },
    }
  )
} 