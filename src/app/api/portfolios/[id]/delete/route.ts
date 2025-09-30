import { getSupabaseServer } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    __request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await getSupabaseServer();

        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if portfolio exists and belongs to user
        const { data: portfolio, error: fetchError } = await supabase
            .from("portfolios")
            .select("id, user_id, images, title")
            .eq("id", id)
            .is("deleted_at", null)  // Only allow deleting non-deleted portfolios
            .single();

        if (fetchError || !portfolio) {
            return NextResponse.json(
                { error: "Portfolio not found" },
                { status: 404 }
            );
        }

        // Check ownership (users can only delete their own portfolios)
        if (portfolio.user_id !== user.id) {
            return NextResponse.json(
                { error: "Forbidden: You can only delete your own portfolios" },
                { status: 403 }
            );
        }

        // Soft delete the portfolio
        const { error: deleteError } = await supabase
            .from("portfolios")
            .update({
                deleted_at: new Date().toISOString(),
                deleted_by: user.id
            })
            .eq("id", id);

        if (deleteError) {
            console.error("Error soft-deleting portfolio:", deleteError);
            return NextResponse.json(
                { error: "Failed to delete portfolio" },
                { status: 500 }
            );
        }

        // Log the deletion for audit

        return NextResponse.json({ 
            message: "Portfolio deleted successfully",
            portfolio_id: id 
        });

    } catch (error) {
        console.error("Error in portfolio delete:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}





