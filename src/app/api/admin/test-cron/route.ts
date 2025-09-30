import { getSupabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from "next/server"

// Fix for Supabase + Next.js 15 Edge Runtime conflict
export const runtime = 'nodejs'

export async function POST(_request: NextRequest) {
    try {
        console.log('🚀 Admin running cron job manually')
        
        const supabase = await getSupabaseServer()
        
        // Check authentication and admin status
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        // Verify admin status
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()

        if (profileError || !profile?.is_admin) {
            return NextResponse.json(
                { error: 'Admin privileges required' },
                { status: 403 }
            )
        }

        // Call the actual cron job endpoint locally
        const baseUrl = process.env.NODE_ENV === 'development' 
            ? 'http://localhost:3000' 
            : `https://${process.env.VERCEL_URL || 'your-app.vercel.app'}`
            
        const cronResponse = await fetch(`${baseUrl}/api/cron/publish-portfolios`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer vibefolio-cron-2025-secure-key-ph-admin`,
                'Content-Type': 'application/json'
            }
        })

        let cronResult
        try {
            cronResult = await cronResponse.json()
        } catch (parseError) {
            // If JSON parsing fails, get the text response for debugging
            const textResponse = await cronResponse.text()
            console.error('Failed to parse cron response as JSON:', textResponse)
            throw new Error(`Cron job returned invalid JSON: ${textResponse.substring(0, 100)}...`)
        }

        if (!cronResponse.ok) {
            throw new Error(`Cron job failed: ${cronResult.error || 'Unknown error'}`)
        }

        console.log('✅ Admin cron job completed:', cronResult)

        return NextResponse.json({
            success: true,
            message: 'Cron job completed successfully',
            result: cronResult
        })

    } catch (error) {
        console.error('❌ Admin cron job failed:', error)
        return NextResponse.json(
            { 
                error: 'Cron job failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}
