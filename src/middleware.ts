import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

// Liste der Routen, die Auth erfordern
const protectedRoutes = [
  '/feedback',
  '/admin',
  '/settings',
  '/profile'
]

// Rate Limiting Setup
const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS = 60 // 60 requests per minute
const rateLimit = new Map<string, { count: number; resetTime: number }>()

// Rate Limiting Funktion
function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const userLimit = rateLimit.get(ip)

  if (!userLimit) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }

  if (now > userLimit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW })
    return false
  }

  if (userLimit.count >= MAX_REQUESTS) {
    return true
  }

  userLimit.count++
  return false
}

export async function middleware(request: NextRequest) {
  // Rate Limiting für Auth-Endpoints
  if (request.nextUrl.pathname.startsWith('/login') || 
      request.nextUrl.pathname.startsWith('/register')) {
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    if (isRateLimited(ip)) {
      return new NextResponse('Too Many Requests', { status: 429 })
    }
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set({ name, value, ...options });
          });
        }
      }
    }
  )

  // Best Practice: Authentifizierten User holen
  const { data: { user } } = await supabase.auth.getUser()

  // Session Persistence: Prüfe ob Session abgelaufen ist
  if (user) {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.expires_at && session.expires_at < Date.now() / 1000) {
        const { data: { session: newSession } } = await supabase.auth.refreshSession()
        if (newSession) {
          // Session wurde erfolgreich aktualisiert
          console.log('Session refreshed successfully')
        }
      }
    } catch (error) {
      console.error('Error refreshing session:', error)
    }
  }

  // Prüfe ob die aktuelle Route geschützt ist
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname.startsWith(route)
  )

  // Wenn die Route geschützt ist und kein User eingeloggt ist, redirect zu login
  if (isProtectedRoute && !user) {
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname)
    return NextResponse.redirect(redirectUrl)
  }

  return response
}

// Konfiguriere auf welchen Pfaden die Middleware ausgeführt werden soll
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}