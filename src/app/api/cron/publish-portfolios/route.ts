import { getSupabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from "next/server"
// Fix for Supabase + Next.js 15 Edge Runtime conflict
export const runtime = 'nodejs'


export async function POST(request: NextRequest) {
    try {
        console.log('🕐 Cron job started: Weekly portfolio publishing')
        
        const supabase = await getSupabaseServer()
        
        // Verify cron job authorization (optional: add secret key check)
        const authHeader = request.headers.get('authorization')
        const expectedAuth = `Bearer ${process.env.CRON_SECRET || 'vibefolio-cron-2025-secure-key-ph-admin'}`
        
        if (authHeader !== expectedAuth) {
            console.log('❌ Unauthorized cron job request:', authHeader)
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // 1. Fetch admin settings
        const { data: settings, error: settingsError } = await supabase
            .from('admin_settings' as any)
            .select('*')
            .single() as { data: any, error: any }

        if (settingsError) {
            console.error('❌ Error fetching admin settings:', settingsError)
            return NextResponse.json(
                { error: 'Failed to fetch admin settings' },
                { status: 500 }
            )
        }

        console.log(`📊 Admin settings: ${settings.weekly_publish_limit} limit, ${settings.publish_strategy} strategy`)

        // Skip if strategy is manual only
        if (settings.publish_strategy === 'manual') {
            console.log('⏭️ Skipping automatic publish - manual strategy enabled')
            return NextResponse.json({
                success: true,
                message: 'Skipped - manual strategy enabled',
                published: 0
            })
        }

        // 2. Fetch approved but unpublished portfolios
        let query = supabase
            .from('portfolios')
            .select(`
                id,
                title,
                updated_at,
                user:profiles!portfolios_user_id_fkey (
                    username,
                    full_name
                )
            `)
            .eq('approved', true)
            .eq('published', false)
            .is('deleted_at', null)

        // Apply sorting strategy
        if (settings.publish_strategy === 'newest_first') {
            query = query.order('updated_at', { ascending: false })
        } else {
            // oldest_first (default)
            query = query.order('updated_at', { ascending: true })
        }

        // Apply weekly limit
        query = query.limit(settings.weekly_publish_limit)

        const { data: portfoliosToPublish, error: portfoliosError } = await query

        if (portfoliosError) {
            console.error('❌ Error fetching portfolios:', portfoliosError)
            return NextResponse.json(
                { error: 'Failed to fetch portfolios' },
                { status: 500 }
            )
        }

        if (!portfoliosToPublish || portfoliosToPublish.length === 0) {
            console.log('📭 No portfolios to publish')
            return NextResponse.json({
                success: true,
                message: 'No portfolios to publish',
                published: 0
            })
        }

        console.log(`📦 Found ${portfoliosToPublish.length} portfolios to publish`)

        // 3. Publish portfolios
        const publishedPortfolios = []
        const errors = []

        for (const portfolio of portfoliosToPublish) {
            try {
                const { error: updateError } = await supabase
                    .from('portfolios')
                    .update({
                        published: true,
                        published_at: new Date().toISOString(),
                        manual_publish: false, // Mark as auto-published
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', portfolio.id)

                if (updateError) {
                    console.error(`❌ Error publishing portfolio ${portfolio.id}:`, updateError)
                    errors.push({
                        id: portfolio.id,
                        title: portfolio.title,
                        error: updateError.message
                    })
                } else {
                    console.log(`✅ Published: ${portfolio.title} (${portfolio.id})`)
                    publishedPortfolios.push({
                        id: portfolio.id,
                        title: portfolio.title,
                        user: portfolio.user
                    })
                }
            } catch (error) {
                console.error(`❌ Unexpected error publishing portfolio ${portfolio.id}:`, error)
                errors.push({
                    id: portfolio.id,
                    title: portfolio.title,
                    error: error instanceof Error ? error.message : 'Unknown error'
                })
            }
        }

        // 4. Log results
        console.log(`🎉 Cron job completed: ${publishedPortfolios.length} published, ${errors.length} errors`)
        
        if (publishedPortfolios.length > 0) {
            console.log('📋 Published portfolios:')
            publishedPortfolios.forEach(p => {
                console.log(`  - ${p.title} by ${p.user?.username || p.user?.full_name || 'Unknown'}`)
            })
        }

        if (errors.length > 0) {
            console.log('⚠️ Errors:')
            errors.forEach(e => {
                console.log(`  - ${e.title}: ${e.error}`)
            })
        }

        return NextResponse.json({
            success: true,
            message: `Published ${publishedPortfolios.length} portfolios`,
            published: publishedPortfolios.length,
            errors: errors.length,
            details: {
                published: publishedPortfolios,
                errors: errors
            }
        })

    } catch (error) {
        console.error('❌ Cron job failed:', error)
        return NextResponse.json(
            { 
                error: 'Cron job failed',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        )
    }
}

// Also support GET for testing
export async function GET(request: NextRequest) {
    // Only allow in development
    if (process.env.NODE_ENV !== 'development') {
        return NextResponse.json(
            { error: 'GET method only available in development' },
            { status: 403 }
        )
    }

    console.log('🧪 Testing cron job via GET request')
    return POST(request)
}
