import { createServerClient } from '@supabase/ssr';
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    async get(name: string) {
                        return (await cookies()).get(name)?.value
                    },
                    async set(name: string, value: string, options: any) {
                        (await cookies()).set(name, value, options)
                    },
                    async remove(name: string, options: any) {
                        (await cookies()).set(name, '', options)
                    }
                }
            }
        )
        
        // Get session first
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        
        if (sessionError) {
            console.error("Session error:", sessionError)
            return NextResponse.json({ error: "Authentication error" }, { status: 401 })
        }

        if (!session?.user) {
            console.error("No session found")
            return NextResponse.json({ error: "Not authenticated" }, { status: 401 })
        }

        const { portfolioId, content, parentId, positiveChips, negativeChips } = await request.json()

        if (!portfolioId) {
            return NextResponse.json(
                { error: "Portfolio ID is required" },
                { status: 400 }
            )
        }

        // Start a transaction to save all feedback at once
        const { error: transactionError } = await supabase.rpc('save_feedback', {
            p_portfolio_id: portfolioId,
            p_positive_chips: positiveChips || [],
            p_negative_chips: negativeChips || [],
            p_comments: content || ''
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
                .from("portfolio_comments")
                .insert({
                    portfolio_id: portfolioId,
                    user_id: session.user.id,
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