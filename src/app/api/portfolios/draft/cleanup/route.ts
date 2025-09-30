import { getSupabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

export async function DELETE(__request: NextRequest) {
    try {
        const supabase = await getSupabaseServer()
        
        // Get authenticated user
        const { data: { user }, error: authError } = await supabase.auth.getUser()
        
        if (authError || !user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            )
        }

        // Delete any existing draft for this user
        const { error } = await supabase
            .from('portfolios')
            .delete()
            .eq('user_id', user.id)
            .eq('status', 'draft')

        if (error) {
            console.error('Error cleaning up draft:', error)
            return NextResponse.json(
                { error: 'Failed to clean up draft' },
                { status: 500 }
            )
        }

        return NextResponse.json({ success: true })

    } catch (error) {
        console.error('Error in draft cleanup:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}