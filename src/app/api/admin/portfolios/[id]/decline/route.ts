import { getSupabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from "next/server"

export async function POST(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await getSupabaseServer()
        const { id } = await params
        

        // Parse request body for decline reason
        const body = await _request.json().catch(() => ({}))
        const { reason } = body
        

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

        // Check if portfolio exists and is pending
        const { data: portfolio, error: portfolioError } = await supabase
            .from('portfolios')
            .select('id, status, title, user_id')
            .eq('id', id)
            .single()

        if (portfolioError) {
            return NextResponse.json(
                { error: 'Portfolio not found' },
                { status: 404 }
            )
        }

        if (portfolio.status !== 'pending') {
            return NextResponse.json(
                { error: `Portfolio is already ${portfolio.status}` },
                { status: 400 }
            )
        }

        // Decline the portfolio
        const { error: updateError } = await supabase
            .from('portfolios')
            .update({
                status: 'declined',
                approved: false,
                published: false,
                declined_reason: reason || null,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        if (updateError) {
            console.error('Error declining portfolio:', updateError)
            return NextResponse.json(
                { error: 'Failed to decline portfolio' },
                { status: 500 }
            )
        }

        // Log the decline action (optional - for audit trail)
        console.log(`Portfolio ${id} (${portfolio.title}) declined by admin ${user.id}${reason ? ` - Reason: ${reason}` : ''}`)

        return NextResponse.json({
            success: true,
            message: 'Portfolio declined successfully'
        })

    } catch (error) {
        console.error('Admin decline API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}