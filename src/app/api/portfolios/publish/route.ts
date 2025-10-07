import { getSupabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// Fix for Supabase + Next.js 15 Edge Runtime conflict
export const runtime = 'nodejs'

/**
 * POST /api/portfolios/publish
 * Sets is_visible = true for a published (offline) portfolio
 * This makes the portfolio publicly visible again
 */
export async function POST(_request: NextRequest) {
    try {
        const supabase = await getSupabaseServer()
        
        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Authentication required' },
                { status: 401 }
            )
        }

        // Get user's current portfolio
        const { data: portfolio, error: portfolioError } = await supabase
            .from('portfolios')
            .select('id, status, approved, published, is_visible')
            .eq('user_id', user.id)
            .is('deleted_at', null)
            .single()

        if (portfolioError || !portfolio) {
            return NextResponse.json(
                { error: 'Portfolio not found' },
                { status: 404 }
            )
        }

        // Verify portfolio is published but offline
        if (portfolio.status !== 'approved' || !portfolio.published || portfolio.is_visible) {
            return NextResponse.json(
                { error: 'Portfolio is not in offline state' },
                { status: 400 }
            )
        }

        // Set is_visible = true to publish
        const { error: updateError } = await supabase
            .from('portfolios')
            .update({
                is_visible: true,
                updated_at: new Date().toISOString()
            })
            .eq('id', portfolio.id)

        if (updateError) {
            console.error('Error publishing portfolio:', updateError)
            return NextResponse.json(
                { error: 'Failed to publish portfolio' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            message: 'Portfolio published successfully'
        })

    } catch (error) {
        console.error('Portfolio publish API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

