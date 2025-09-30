// lib/supabase-server.ts (Server-only) - Next.js 15 compatible
import { Database } from '@/types/database.types'
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import 'server-only'

export async function getSupabaseServer() {
  const cookieStore = await cookies() // Next.js 15: async
  
  // Pre-fetch all cookies to avoid sync calls during createServerClient
  const allCookies = cookieStore.getAll()
  const cookieMap = new Map(allCookies.map(cookie => [cookie.name, cookie.value]))
  
  const client = createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        get: (name) => cookieMap.get(name),
        set() {}, // Read-only in Server Components
        remove() {} // Read-only in Server Components
      }
    }
  )
  return client
}
