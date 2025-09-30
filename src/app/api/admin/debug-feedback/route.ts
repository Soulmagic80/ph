import { getSupabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export const runtime = 'nodejs'

export async function GET(_request: NextRequest) {
    try {
        const supabase = await getSupabaseServer()
        
        // Get authenticated user and check admin
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
            return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()

        if (!profile?.is_admin) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 })
        }

        // Debug user_feedback_count table
        const { data: feedbackCounts, error: feedbackError } = await supabase
            .from('user_feedback_count')
            .select('*')

        // Debug feedback_status table
        const { data: feedbackStatus, error: statusError } = await supabase
            .from('feedback_status')
            .select('user_id, status')
            .eq('status', 'completed')

        // Debug portfolios with user info
        const { data: portfolios, error: portfoliosError } = await supabase
            .from('portfolios')
            .select(`
                id,
                user_id,
                title,
                status,
                user:profiles!portfolios_user_id_fkey (
                    id,
                    username,
                    full_name
                )
            `)
            .is('deleted_at', null)
            .limit(5)

        return NextResponse.json({
            message: 'Feedback count debug data',
            data: {
                user_feedback_count: {
                    data: feedbackCounts,
                    error: feedbackError?.message,
                    count: feedbackCounts?.length || 0
                },
                feedback_status: {
                    data: feedbackStatus,
                    error: statusError?.message,
                    count: feedbackStatus?.length || 0
                },
                portfolios: {
                    data: portfolios,
                    error: portfoliosError?.message,
                    count: portfolios?.length || 0
                },
                target_user_id: '1f21ab31-217d-4213-ad20-9209faa33c4c'
            }
        })

    } catch (error) {
        console.error('Error in feedback debug:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
