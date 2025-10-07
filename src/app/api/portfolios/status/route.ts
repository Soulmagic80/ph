import { getSupabaseServer } from '@/lib/supabase-server'
import { NextRequest, NextResponse } from 'next/server'

// Fix for Supabase + Next.js 15 Edge Runtime conflict
export const runtime = 'nodejs'

export async function GET(_request: NextRequest) {
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

        // Get user's current portfolio (any status)
        const { data: portfolio, error: portfolioError } = await supabase
            .from('portfolios')
            .select(`
                id,
                title,
                website_url,
                description,
                status,
                approved,
                published,
                is_visible,
                created_at,
                updated_at,
                declined_reason,
                images,
                tags,
                style
            `)
            .eq('user_id', user.id)
            .is('deleted_at', null)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (portfolioError) {
            console.error('Error fetching portfolio:', portfolioError)
            return NextResponse.json(
                { error: 'Failed to fetch portfolio status' },
                { status: 500 }
            )
        }

        // If no portfolio exists, return draft state (user can create one)
        if (!portfolio) {
            return NextResponse.json({
                success: true,
                portfolio: null,
                status: 'draft',
                approved: false,
                published: false,
                is_visible: true,
                feedback_count: 0,
                // Draft capabilities - user can create a new portfolio
                canEdit: true,
                canSubmit: true,
                canPreview: true,
                canClearAll: true,
                showEditButton: false,
                showWithdrawButton: false,
                statusBadge: 'DRAFT',
                statusMessage: 'Ready to create your portfolio',
                statusType: 'info'
            })
        }

        // Get feedback count for this user
        let feedbackCount = 0
        const { data: feedbackData } = await supabase
            .from('user_feedback_count')
            .select('count')
            .eq('user_id', user.id)
            .single()

        if (feedbackData) {
            feedbackCount = feedbackData.count || 0
        }

        // Get tools for this portfolio
        let portfolioTools = []
        const { data: toolsData } = await supabase
            .from('portfolio_tools')
            .select(`
                tool:tools(id, name, category)
            `)
            .eq('portfolio_id', portfolio.id)
        
        portfolioTools = toolsData?.map((pt: any) => pt.tool) || []

        // Determine UI capabilities based on status, approved, and published
        const capabilities = getStatusCapabilities(
            portfolio.status || 'none',
            portfolio.approved || false,
            portfolio.published || false
        )

        // Format response
        const response = {
            success: true,
            portfolio: {
                id: portfolio.id,
                title: portfolio.title,
                website_url: portfolio.website_url,
                description: portfolio.description,
                images: portfolio.images || [],
                tags: portfolio.tags || [],
                style: portfolio.style || [],
                tools: portfolioTools,
                created_at: portfolio.created_at,
                updated_at: portfolio.updated_at,
                declined_reason: portfolio.declined_reason
            },
            status: portfolio.status,
            approved: portfolio.approved,
            published: portfolio.published,
            is_visible: portfolio.is_visible !== false, // Default to true if null
            feedback_count: feedbackCount,
            ...capabilities
        }

        return NextResponse.json(response)

    } catch (error) {
        console.error('Portfolio status API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

/**
 * Determines what UI actions are available based on portfolio status
 */
function getStatusCapabilities(status: string, _approved: boolean, published: boolean) {
    switch (status) {
        case 'draft':
            return {
                canEdit: true,
                canSubmit: true,
                canPreview: true,
                canClearAll: true,
                showEditButton: false,
                showWithdrawButton: false,
                statusBadge: 'DRAFT',
                statusMessage: 'Continue editing your portfolio',
                statusType: 'info' as const
            }
        
        case 'pending':
            return {
                canEdit: false,
                canSubmit: false,
                canPreview: true,
                canClearAll: false,
                showEditButton: false,
                showWithdrawButton: true,
                statusBadge: 'PENDING APPROVAL',
                statusMessage: 'Your portfolio is pending admin approval',
                statusType: 'warning' as const
            }
        
        case 'approved':
            // Unterscheidung: Approved aber noch nicht published vs. Published
            if (published) {
                return {
                    canEdit: true,
                    canSubmit: false,
                    canPreview: true,
                    canClearAll: false,
                    showEditButton: false,
                    showWithdrawButton: true,
                    statusBadge: 'PUBLISHED',
                    statusMessage: 'Your portfolio is live!',
                    statusType: 'success' as const
                }
            } else {
                return {
                    canEdit: false,
                    canSubmit: false,
                    canPreview: true,
                    canClearAll: false,
                    showEditButton: false,
                    showWithdrawButton: true,
                    statusBadge: 'APPROVED - IN QUEUE',
                    statusMessage: 'Your portfolio has been approved and is waiting to be published',
                    statusType: 'success' as const
                }
            }
        
        case 'declined':
            return {
                canEdit: true,
                canSubmit: true,
                canPreview: true,
                canClearAll: true,
                showEditButton: false,
                showWithdrawButton: false,
                statusBadge: 'DECLINED',
                statusMessage: 'Your portfolio was declined. Please review the feedback and resubmit.',
                statusType: 'error' as const
            }
        
        default:
            return {
                canEdit: true,
                canSubmit: true,
                canPreview: true,
                canClearAll: true,
                showEditButton: false,
                showWithdrawButton: false,
                statusBadge: 'DRAFT',
                statusMessage: 'Ready to create your portfolio',
                statusType: 'info' as const
            }
    }
}

/**
 * Updates portfolio status (for future use)
 */
export async function PATCH(request: NextRequest) {
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

        const { action } = await request.json()

        // Get user's current portfolio
        const { data: portfolio, error: portfolioError } = await supabase
            .from('portfolios')
            .select('id, status, approved, published')
            .eq('user_id', user.id)
            .is('deleted_at', null)
            .single()

        if (portfolioError || !portfolio) {
            return NextResponse.json(
                { error: 'Portfolio not found' },
                { status: 404 }
            )
        }

        let updateData: any = {}
        const now = new Date().toISOString()

        switch (action) {
            case 'withdraw':
                // Scenario 1: PENDING → DRAFT
                if (portfolio.status === 'pending') {
                    updateData = {
                        status: 'draft',
                        approved: false,
                        published: false,
                        updated_at: now
                    }
                }
                // Scenario 2: APPROVED (in queue) → DRAFT
                else if (portfolio.status === 'approved' && !portfolio.published) {
                    updateData = {
                        status: 'draft',
                        approved: false,
                        published: false,
                        updated_at: now
                    }
                }
                // Scenario 3: PUBLISHED → PUBLISHED (offline)
                else if (portfolio.status === 'approved' && portfolio.published) {
                    updateData = {
                        is_visible: false,
                        updated_at: now
                    }
                }
                else {
                    return NextResponse.json(
                        { error: 'Cannot withdraw portfolio in current state' },
                        { status: 400 }
                    )
                }
                break
            
            case 'resubmit':
                // Allow resubmitting declined portfolios
                if (portfolio.status !== 'declined') {
                    return NextResponse.json(
                        { error: 'Can only resubmit declined portfolios' },
                        { status: 400 }
                    )
                }
                updateData = {
                    status: 'pending',
                    declined_reason: null,
                    updated_at: now
                }
                break
            
            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                )
        }

        // Update portfolio with the prepared data
        const { error: updateError } = await supabase
            .from('portfolios')
            .update(updateData)
            .eq('id', portfolio.id)

        if (updateError) {
            console.error('Error updating portfolio status:', updateError)
            return NextResponse.json(
                { error: 'Failed to update portfolio status' },
                { status: 500 }
            )
        }

        return NextResponse.json({
            success: true,
            status: updateData.status || portfolio.status,
            message: action === 'withdraw' 
                ? 'Portfolio withdrawn successfully' 
                : 'Portfolio resubmitted for review'
        })

    } catch (error) {
        console.error('Portfolio status update error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
