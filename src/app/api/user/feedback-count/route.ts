import { getSupabaseServer } from '@/lib/supabase-server'
import { NextResponse } from 'next/server'

export async function GET() {
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

        // Get user's feedback count from user_feedback_count table
        const { data: feedbackData, error: feedbackError } = await supabase
            .from('user_feedback_count')
            .select('count')
            .eq('user_id', user.id)
            .single()

        if (feedbackError) {
            // If no record exists, return 0
            if (feedbackError.code === 'PGRST116') {
                return NextResponse.json({ count: 0 })
            }
            
            console.error('Error fetching user feedback count:', feedbackError)
            return NextResponse.json(
                { error: 'Failed to fetch feedback count' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            count: feedbackData?.count || 0
        })

    } catch (error) {
        console.error('Error in feedback count API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
