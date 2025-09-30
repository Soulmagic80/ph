import { getSupabaseServer } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(
    __request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const supabase = await getSupabaseServer();

        // Get current user and verify admin status
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        // Check if user is admin
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("is_admin")
            .eq("id", user.id)
            .single();

        if (profileError || !profile?.is_admin) {
            return NextResponse.json(
                { error: "Forbidden: Admin access required" },
                { status: 403 }
            );
        }

        // Check if portfolio exists
        const { data: portfolio, error: fetchError } = await supabase
            .from("portfolios")
            .select("id, user_id, images, title, deleted_at")
            .eq("id", id)
            .single();

        if (fetchError || !portfolio) {
            return NextResponse.json(
                { error: "Portfolio not found" },
                { status: 404 }
            );
        }

        // Check if already soft-deleted
        if (portfolio.deleted_at) {
            return NextResponse.json(
                { error: "Portfolio is already deleted" },
                { status: 400 }
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

        // Log the admin deletion for audit
        console.log(`Portfolio soft-deleted by admin: ${portfolio.title} (${id}) by admin ${user.id}`);

        return NextResponse.json({ 
            message: "Portfolio deleted successfully by admin",
            portfolio_id: id,
            deleted_by: user.id
        });

    } catch (error) {
        console.error("Error in admin portfolio delete:", error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}






