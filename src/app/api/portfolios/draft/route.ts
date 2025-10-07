import { getSupabaseServer } from '@/lib/supabase-server';
import { NextRequest, NextResponse } from 'next/server';

// Fix for Supabase + Next.js 15 Edge Runtime conflict
export const runtime = 'nodejs'

// Helper function to normalize website URLs
function normalizeWebsiteUrl(url: string): string {
    if (!url) return '';
    
    // Fix double protocols like "https://https://domain.com"
    let cleanUrl = url.replace(/^https?:\/\/https?:\/\//, 'https://');
    
    // Fix malformed protocols like "https//domain.com" 
    cleanUrl = cleanUrl.replace(/^https?\/\//, 'https://');
    
    // If URL already has correct protocol, return it
    if (cleanUrl.startsWith('https://') || cleanUrl.startsWith('http://')) {
        return cleanUrl;
    }
    
    // Remove any remaining protocol fragments
    cleanUrl = cleanUrl.replace(/^https?:?\/?\/?/, '');
    
    // Add https:// prefix
    return `https://${cleanUrl}`;
}

interface DraftPortfolioRequest {
    title?: string
    websiteUrl?: string
    description?: string
    images?: string[] // Array of image URLs or storage paths
    tools?: Array<{
        id: string
        name: string
        category: string
    }>
    tags?: string[]
    styles?: Array<{
        id: string
        name: string
        display_name: string
        category: string
    }>
}

// Helper: Extract storage path from URL
function extractStoragePathFromUrl(urlOrPath: string): string {
    // If already a path (not URL), return as-is
    if (!urlOrPath.startsWith('http')) {
        return urlOrPath
    }
    
    // Extract path from URL: https://.../storage/v1/object/public/portfolio-images/{path}
    const match = urlOrPath.match(/\/portfolio-images\/(.+)$/)
    return match ? match[1] : urlOrPath
}

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

        const body: DraftPortfolioRequest = await _request.json()
        
        
        // Check if user already has a draft or pending portfolio
        const { data: existingDraft, error: draftCheckError } = await supabase
            .from('portfolios')
            .select('id, status')
            .eq('user_id', user.id)
            .in('status', ['draft', 'pending'])
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle()

        if (draftCheckError) {
            console.error('Error checking existing draft:', draftCheckError)
            return NextResponse.json(
                { error: 'Failed to check existing draft' },
                { status: 500 }
            )
        }

        const now = new Date().toISOString()

        if (existingDraft) {
            // Update existing draft
            
            // Convert image URLs to storage paths
            const imagePaths = body.images ? body.images.map(extractStoragePathFromUrl) : undefined

            const { data: updatedDraft, error: updateError } = await supabase
                .from('portfolios')
                .update({
                    ...(body.title !== undefined && { title: body.title }),
                    ...(body.websiteUrl !== undefined && { 
                        website_url: body.websiteUrl?.trim() ? normalizeWebsiteUrl(body.websiteUrl.trim()) : null 
                    }),
                    ...(body.description !== undefined && { description: body.description }),
                    ...(imagePaths !== undefined && { images: imagePaths }),
                    ...(body.tags !== undefined && { tags: body.tags }),
                    ...(body.styles !== undefined && { style: body.styles.map(s => s.name) }),
                    updated_at: now
                })
                .eq('id', existingDraft.id)
                .select('id, title, website_url, description, images, tags, style, status')
                .single()
                

            if (updateError) {
                console.error('Error updating draft:', updateError)
                return NextResponse.json(
                    { error: `Failed to update draft: ${updateError.message}` },
                    { status: 500 }
                )
            }

            // Update tools if provided (always delete and re-insert to handle removals)
            if (body.tools !== undefined) {
                // Delete existing tool links
                await supabase
                    .from('portfolio_tools')
                    .delete()
                    .eq('portfolio_id', existingDraft.id)

                // Insert new tool links if any
                if (body.tools.length > 0) {
                    const toolLinks = body.tools.map(tool => ({
                        portfolio_id: existingDraft.id,
                        tool_id: tool.id,
                        created_at: now
                    }))

                    const { error: toolsError } = await supabase
                        .from('portfolio_tools')
                        .insert(toolLinks)

                    if (toolsError) {
                        console.error('Error updating tools:', toolsError)
                        // Don't fail the request for tools error
                    }
                }
            }

            return NextResponse.json({
                success: true,
                draft: {
                    id: updatedDraft.id,
                    status: 'updated'
                }
            })

        } else {
            // Create new draft
            
            // Convert image URLs to storage paths
            const imagePaths = body.images ? body.images.map(extractStoragePathFromUrl) : []
            
            // Build insert object with only defined values
            const insertData: any = {
                user_id: user.id,
                images: imagePaths,
                tags: body.tags || [],
                style: body.styles ? body.styles.map(s => s.name) : [],
                status: 'draft',
                approved: false,
                published: false,
                created_at: now,
                updated_at: now
            }
            
            if (body.title) insertData.title = body.title
            if (body.websiteUrl?.trim()) insertData.website_url = normalizeWebsiteUrl(body.websiteUrl.trim())
            if (body.description) insertData.description = body.description

            const { data: newDraft, error: createError } = await supabase
                .from('portfolios')
                .insert(insertData)
                .select('id, title, website_url, description, images, tags, style, status')
                .single()

            if (createError) {
                console.error('Error creating draft:', createError)
                return NextResponse.json(
                    { error: 'Failed to create draft' },
                    { status: 500 }
                )
            }

            // Link tools if provided
            if (body.tools && body.tools.length > 0) {
                const toolLinks = body.tools.map(tool => ({
                    portfolio_id: newDraft.id,
                    tool_id: tool.id,
                    created_at: now
                }))

                const { error: toolsError } = await supabase
                    .from('portfolio_tools')
                    .insert(toolLinks)

                if (toolsError) {
                    console.error('Error linking tools:', toolsError)
                    // Don't fail the request for tools error
                }
            }

            return NextResponse.json({
                success: true,
                draft: {
                    id: newDraft.id,
                    status: 'created'
                }
            })
        }

    } catch (error) {
        console.error('Draft API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}

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

        // Get user's draft or pending portfolio (for editing)
        const { data: draft, error: draftError } = await supabase
            .from('portfolios')
            .select('*')
            .eq('user_id', user.id)
            .in('status', ['draft', 'pending'])
            .is('deleted_at', null)  // Exclude soft-deleted drafts
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle()
            
            
        // Get tools separately if draft exists
        let draftTools = []
        if (draft) {
            const { data: toolsData } = await supabase
                .from('portfolio_tools')
                .select(`
                    tool:tools(id, name, category)
                `)
                .eq('portfolio_id', draft.id)
            
            draftTools = toolsData?.map((pt: any) => pt.tool) || []
        }

        if (draftError) {
            console.error('Error fetching draft:', draftError)
            return NextResponse.json(
                { error: 'Failed to fetch draft' },
                { status: 500 }
            )
        }

        if (!draft) {
            return NextResponse.json({
                success: true,
                draft: null
            })
        }

        // Use the tools we fetched separately
        const formattedTools = draftTools

        // Convert style array back to style objects format
        const formattedStyles = (draft.style || []).map((styleName: string) => ({
            id: styleName,
            name: styleName,
            display_name: styleName,
            category: null
        }));

        // Convert storage paths to full URLs
        const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
        const imageUrls = (draft.images || []).map((path: string) => {
            // If already a full URL, return as-is
            if (path.startsWith('http')) {
                return path
            }
            // Convert path to URL
            return `${SUPABASE_URL}/storage/v1/object/public/portfolio-images/${path}`
        })

        return NextResponse.json({
            success: true,
            draft: {
                id: draft.id,
                title: draft.title,
                website_url: draft.website_url,
                description: draft.description,
                images: imageUrls,
                tags: draft.tags || [],
                tools: formattedTools,
                styles: formattedStyles,
                updated_at: draft.updated_at
            }
        })

    } catch (error) {
        console.error('Draft GET API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}








