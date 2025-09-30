import { getSupabaseServer } from '@/lib/supabase-server';
import { NextResponse } from "next/server";

export async function POST(_request: Request) {
    try {
        const supabase = await getSupabaseServer()
        
        // Get user first
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        
        if (userError) {
            console.error("User error:", userError)
            return NextResponse.json({ error: "Authentication error" }, { status: 401 })
        }

        if (!user) {
            console.error("No user found")
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        const { portfolioId, content, parentId, positiveChips, negativeChips } = await _request.json()

        if (!portfolioId) {
            return NextResponse.json(
                { error: "Portfolio ID is required" },
                { status: 400 }
            )
        }

        // Start a transaction to save all feedback at once
        const { error: transactionError } = await (supabase.rpc as any)('save_portfolio_feedback', {
            p_portfolio_id: portfolioId,
            p_user_id: user.id,
            p_positive_chips: positiveChips || [],
            p_negative_chips: negativeChips || [],
            p_comment: content || ''
        })

        if (transactionError) {
            console.error("Error saving feedback:", transactionError)
            return NextResponse.json(
                { error: "Failed to save feedback" },
                { status: 500 }
            )
        }

        // If there's a comment, save it in the same transaction
        if (content) {
            const { error: commentError } = await supabase
                .from("comments")
                .insert({
                    portfolio_id: portfolioId,
                    user_id: user.id,
                    content,
                    parent_id: parentId || null,
                })

            if (commentError) {
                console.error("Error saving comment:", commentError)
                return NextResponse.json(
                    { error: "Failed to save comment" },
                    { status: 500 }
                )
            }
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error("Error in feedback route:", error)
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        )
    }
} 