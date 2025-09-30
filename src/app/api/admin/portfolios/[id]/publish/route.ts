import { getSupabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from "next/server"

export async function POST(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await getSupabaseServer()
        const { id } = await params
        
        console.log('🚀 Admin publish request for portfolio:', id)

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

        // Check if portfolio exists and is approved
        const { data: portfolio, error: portfolioError } = await supabase
            .from('portfolios')
            .select('id, status, approved, published, title, user_id')
            .eq('id', id)
            .single()

        if (portfolioError) {
            return NextResponse.json(
                { error: 'Portfolio not found' },
                { status: 404 }
            )
        }

        if (!portfolio.approved) {
            return NextResponse.json(
                { error: 'Portfolio must be approved before publishing' },
                { status: 400 }
            )
        }

        if (portfolio.published) {
            return NextResponse.json(
                { error: 'Portfolio is already published' },
                { status: 400 }
            )
        }

        // Publish the portfolio
        const { error: updateError } = await supabase
            .from('portfolios')
            .update({
                published: true,
                published_at: new Date().toISOString(),
                manual_publish: true, // Mark as manually published
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        if (updateError) {
            console.error('Error publishing portfolio:', updateError)
            return NextResponse.json(
                { error: 'Failed to publish portfolio' },
                { status: 500 }
            )
        }

        // Log the publish action
        console.log(`✅ Portfolio ${id} (${portfolio.title}) published manually by admin ${user.id}`)

        return NextResponse.json({
            success: true,
            message: 'Portfolio published successfully'
        })

    } catch (error) {
        console.error('Admin publish API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
