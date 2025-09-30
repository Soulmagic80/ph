import { createServerSupabaseClient } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const supabase = await createServerSupabaseClient();

        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check if user is admin
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single();

        if (!profile?.is_admin) {
            return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
        }

        const resolvedParams = await params;
        const portfolioId = resolvedParams.id;

        // Get current portfolio status
        const { data: portfolio, error: fetchError } = await supabase
            .from('portfolios')
            .select('id, status, published, approved, title')
            .eq('id', portfolioId)
            .single();

        if (fetchError) {
            console.error('Error fetching portfolio:', fetchError);
            return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
        }

        // Validate that portfolio can be unpublished
        if (portfolio.status !== 'approved' || !portfolio.published) {
            return NextResponse.json({ 
                error: 'Can only unpublish approved and published portfolios' 
            }, { status: 400 });
        }

        // Unpublish portfolio (set back to pending)
        const { error: updateError } = await supabase
            .from('portfolios')
            .update({
                status: 'pending',
                published: false,
                approved: false,
                updated_at: new Date().toISOString()
            })
            .eq('id', portfolioId);

        if (updateError) {
            console.error('Error unpublishing portfolio:', updateError);
            return NextResponse.json({ error: 'Failed to unpublish portfolio' }, { status: 500 });
        }

        return NextResponse.json({
            success: true,
            message: `Portfolio "${portfolio.title}" has been unpublished and moved back to pending status`
        });

    } catch (error) {
        console.error('Unpublish portfolio error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
