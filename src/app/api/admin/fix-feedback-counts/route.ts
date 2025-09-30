import { getSupabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

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

        // Check if user is admin
        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()

        if (profileError || !profile?.is_admin) {
            return NextResponse.json(
                { error: 'Admin access required' },
                { status: 403 }
            )
        }

        // Get all users who have portfolios but no feedback count entry
        const { data: usersWithPortfolios, error: portfolioError } = await supabase
            .from('portfolios')
            .select('user_id')
            .is('deleted_at', null)

        if (portfolioError) {
            console.error('Error fetching users with portfolios:', portfolioError)
            return NextResponse.json(
                { error: 'Failed to fetch users' },
                { status: 500 }
            )
        }

        const userIds = [...new Set(usersWithPortfolios?.map(p => p.user_id) || [])]

        // Get existing feedback count entries
        const { data: existingCounts, error: existingError } = await supabase
            .from('user_feedback_count')
            .select('user_id')
            .in('user_id', userIds)

        if (existingError) {
            console.error('Error fetching existing feedback counts:', existingError)
            return NextResponse.json(
                { error: 'Failed to fetch existing counts' },
                { status: 500 }
            )
        }

        const existingUserIds = new Set(existingCounts?.map(c => c.user_id) || [])
        const missingUserIds = userIds.filter(id => !existingUserIds.has(id))

        console.log('🔍 Users with portfolios:', userIds.length)
        console.log('🔍 Users with feedback counts:', existingUserIds.size)
        console.log('🔍 Users missing feedback counts:', missingUserIds.length)
        console.log('🔍 Missing user IDs:', missingUserIds)

        if (missingUserIds.length === 0) {
            return NextResponse.json({
                message: 'All users already have feedback count entries',
                usersChecked: userIds.length,
                missingCount: 0
            })
        }

        // Create feedback count entries for missing users with default count of 5
        const newEntries = missingUserIds.map(userId => ({
            user_id: userId,
            count: 5
        }))

        const { data: insertedEntries, error: insertError } = await supabase
            .from('user_feedback_count')
            .insert(newEntries)
            .select()

        if (insertError) {
            console.error('Error inserting feedback counts:', insertError)
            return NextResponse.json(
                { error: 'Failed to create feedback count entries' },
                { status: 500 }
            )
        }

        console.log('✅ Created feedback count entries:', insertedEntries?.length)

        return NextResponse.json({
            message: 'Successfully created missing feedback count entries',
            usersChecked: userIds.length,
            entriesCreated: insertedEntries?.length || 0,
            createdEntries: insertedEntries
        })

    } catch (error) {
        console.error('Error in fix feedback counts API:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
