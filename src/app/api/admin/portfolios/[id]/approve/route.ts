import { getSupabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from "next/server"

export async function POST(
    __request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await getSupabaseServer()
        const { id } = await params
        

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

        // Update portfolio - approve but don't publish yet
        const { error: updateError } = await supabase
            .from('portfolios')
            .update({
                status: 'approved',
                approved: true,
                published: false,  // Will be published via CronJob tab or cron job
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        if (updateError) {
            console.error('Error approving portfolio:', updateError)
            return NextResponse.json(
                { error: 'Failed to approve portfolio' },
                { status: 500 }
            )
        }

        // Log the approval action (optional - for audit trail)
        console.log(`Portfolio ${id} (${portfolio.title}) approved by admin ${user.id}`)

        return NextResponse.json({
            success: true,
            message: 'Portfolio approved successfully'
        })

    } catch (error) {
        console.error('Admin approve API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}