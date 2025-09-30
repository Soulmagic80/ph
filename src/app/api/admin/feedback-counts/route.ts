import { getSupabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
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

        // Get user IDs from request
        const { userIds } = await request.json()
        
        if (!userIds || !Array.isArray(userIds)) {
            return NextResponse.json({ error: 'userIds array required' }, { status: 400 })
        }


        // Get feedback counts for each user individually (same pattern as /api/user/feedback-count)
        const feedbackCountMap: Record<string, number> = {}
        
        for (const userId of userIds) {
            try {
                const { data: feedbackData, error: feedbackError } = await supabase
                    .from('user_feedback_count')
                    .select('count')
                    .eq('user_id', userId)
                    .single()

                if (feedbackError) {
                    // If no record exists (PGRST116), set to 0
                    if (feedbackError.code === 'PGRST116') {
                        feedbackCountMap[userId] = 0
                    } else {
                        console.warn(`Error fetching feedback count for user ${userId}:`, feedbackError)
                        feedbackCountMap[userId] = 0
                    }
                } else {
                    feedbackCountMap[userId] = feedbackData?.count || 0
                }
            } catch (error) {
                console.warn(`Failed to fetch feedback count for user ${userId}:`, error)
                feedbackCountMap[userId] = 0
            }
        }


        return NextResponse.json({ 
            success: true, 
            feedbackCounts: feedbackCountMap 
        })

    } catch (error) {
        console.error('Error in feedback counts API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
