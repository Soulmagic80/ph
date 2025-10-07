import { cleanupTempFolder } from '@/lib/imageUtils';
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

interface UploadPortfolioRequest {
    title: string
    websiteUrl: string
    description: string
    images: Array<{
        id: string
        file: string // base64 encoded file data
        fileName: string
        contentType: string
        isNew?: boolean
    }> | string[] // Can also be array of URLs for already uploaded images
    existingImages?: string[] // Existing image filenames to keep
    tools: Array<{
        id: string
        name: string
        category: string
    }>
    tags: string[]
    styles: Array<{
        id: string
        name: string
        display_name: string
        category: string
    }>
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

        // Parse request body
        const body: UploadPortfolioRequest = await _request.json()
        
        // Validate required fields
        if (!body.title?.trim()) {
            return NextResponse.json(
                { error: 'Portfolio title is required' },
                { status: 400 }
            )
        }

        // Check total images (new + existing)
        const totalImages = (body.images?.length || 0) + (body.existingImages?.length || 0);
        
        if (totalImages === 0) {
            return NextResponse.json(
                { error: 'At least one image is required' },
                { status: 400 }
            )
        }

        if (totalImages > 4) {
            return NextResponse.json(
                { error: 'Maximum 4 images allowed' },
                { status: 400 }
            )
        }

        // Check if user has sufficient feedback count (5 required) and admin status
        const { data: profile } = await supabase
            .from('profiles')
            .select('is_admin')
            .eq('id', user.id)
            .single()

        const isAdmin = profile?.is_admin || false

        // Check if user already has a portfolio - if yes, UPDATE instead of CREATE
        // Skip for admin users - they can create unlimited portfolios
        let existingPortfolio = null;
        
        if (!isAdmin) {
            const { data: portfolioData, error: portfolioCheckError } = await supabase
                .from('portfolios')
                .select('id, status')
                .eq('user_id', user.id)
                .is('deleted_at', null)
                .maybeSingle()

            if (portfolioCheckError) {
                console.error('Error checking existing portfolios:', portfolioCheckError)
                return NextResponse.json(
                    { error: `Failed to check existing portfolios: ${portfolioCheckError.message}` },
                    { status: 500 }
                )
            }
            
            existingPortfolio = portfolioData;
        }

        if (!isAdmin) {
            const { data: feedbackData, error: feedbackError } = await supabase
                .from('user_feedback_count')
                .select('count')
                .eq('user_id', user.id)
                .single()

            if (feedbackError && feedbackError.code !== 'PGRST116') {
                console.error('Error checking feedback count:', feedbackError)
                return NextResponse.json(
                    { error: 'Failed to verify feedback requirements' },
                    { status: 500 }
                )
            }

            const feedbackCount = feedbackData?.count || 0

            if (feedbackCount < 5) {
                return NextResponse.json(
                    { error: `You need to provide feedback on at least 5 portfolios before uploading. Current: ${feedbackCount}/5` },
                    { status: 400 }
                )
            }
        }

        // Upload images to Supabase Storage using service role
        const uploadedImagePaths: string[] = []
        const imageFilenames: string[] = []
        const existingImagePaths: string[] = [] // Track already uploaded images
        
        // Generate single temp folder for this upload session
        const tempFolder = `temp/${user.id}_${Date.now()}`
        
        // Create service role client for storage operations
        const { createClient } = await import('@supabase/supabase-js')
        const serviceRoleClient = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.SUPABASE_SERVICE_ROLE_KEY!
        )
        
        // Check if images are URLs (already uploaded) or base64 data (new uploads)
        const isUrlArray = typeof body.images[0] === 'string'
        
        if (isUrlArray) {
            // Images are already uploaded URLs - extract storage paths
            for (const imageUrl of body.images as string[]) {
                try {
                    // Extract storage path from URL
                    // Format: https://.../storage/v1/object/public/portfolio-images/{path}
                    const urlMatch = imageUrl.match(/\/portfolio-images\/(.+)$/)
                    if (!urlMatch) {
                        console.error('Invalid image URL format:', imageUrl)
                        continue
                    }
                    
                    const storagePath = urlMatch[1] // e.g., "temp/user_123/image.jpg" or "user_id/image.jpg"
                    existingImagePaths.push(storagePath)
                    
                    // Extract filename from path
                    const filename = storagePath.split('/').pop() || ''
                    imageFilenames.push(filename)
                    
                } catch (error) {
                    console.error('Error processing image URL:', imageUrl, error)
                }
            }
        } else {
            // Images are base64 data - upload them
            for (let i = 0; i < body.images.length; i++) {
                const image = body.images[i] as { id: string; file: string; fileName: string; contentType: string; isNew?: boolean }
                
                try {
                    // Convert base64 to buffer
                    const base64Data = image.file.split(',')[1] // Remove data:image/jpeg;base64, prefix
                    const buffer = Buffer.from(base64Data, 'base64')
                    
                    // Generate temp folder path (HYBRID SYSTEM)
                    const fileExt = image.fileName.split('.').pop()
                    const fileName = i === 0 ? `main.${fileExt}` : `${i}.${fileExt}`
                    // Use shared temp folder for this upload session
                    const storagePath = `${tempFolder}/${fileName}`
                    
                    // Upload to portfolio-images bucket using service role
                    const { error: uploadError } = await serviceRoleClient.storage
                        .from('portfolio-images')
                        .upload(storagePath, buffer, {
                            contentType: image.contentType,
                            cacheControl: '3600',
                            upsert: false
                        })

                    if (uploadError) {
                        console.error('Error uploading image:', uploadError)
                        throw new Error(`Failed to upload image ${i + 1}: ${uploadError.message}`)
                    }

                    uploadedImagePaths.push(storagePath)
                    // Store only filename in database (not full path)
                    imageFilenames.push(fileName)
                    
                } catch (error) {
                    console.error(`Error processing image ${i + 1}:`, error)
                    
                    // Cleanup already uploaded images
                    for (const path of uploadedImagePaths) {
                        await serviceRoleClient.storage
                            .from('portfolio-images')
                            .remove([path])
                    }
                    
                    return NextResponse.json(
                        { error: `Failed to upload image ${i + 1}` },
                        { status: 500 }
                    )
                }
            }
        }

        // Combine existing images with new images (remove duplicates)
        const allImageFilenames = [
            ...(body.existingImages || []), // Keep existing images
            ...imageFilenames // Add new images
        ].filter((filename, index, self) => self.indexOf(filename) === index); // Remove duplicates
        

        // Create or update portfolio in database
        // Create or update portfolio record
        let portfolio, portfolioError
        
        if (existingPortfolio) {
            // UPDATE existing portfolio
            const { data, error } = await supabase
                .from('portfolios')
                .update({
                    title: body.title.trim(),
                    website_url: body.websiteUrl?.trim() ? normalizeWebsiteUrl(body.websiteUrl.trim()) : null,
                    description: body.description?.trim() || null,
                    images: allImageFilenames, // Use combined images
                    tags: body.tags || [],
                    style: body.styles ? body.styles.map(s => s.name) : [],
                    status: 'pending', // Set to pending when submitted
                    approved: false,
                    published: false,
                    updated_at: new Date().toISOString()
                })
                .eq('id', existingPortfolio.id)
                .select()
                .single()
            
            portfolio = data
            portfolioError = error
        } else {
            // CREATE new portfolio
            const { data, error } = await supabase
                .from('portfolios')
                .insert({
                    user_id: user.id,
                    title: body.title.trim(),
                    website_url: body.websiteUrl?.trim() ? normalizeWebsiteUrl(body.websiteUrl.trim()) : null,
                    description: body.description?.trim() || null,
                    images: allImageFilenames, // Use combined images (for CREATE, usually just new images)
                    tags: body.tags || [],
                    style: body.styles ? body.styles.map(s => s.name) : [],
                    status: 'pending', // Pending admin approval
                    approved: false,
                    published: false,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single()
            
            portfolio = data
            portfolioError = error
        }

        if (portfolioError) {
            console.error('Error saving portfolio:', portfolioError)
            
            // Cleanup uploaded images
            for (const path of uploadedImagePaths) {
                await serviceRoleClient.storage
                    .from('portfolio-images')
                    .remove([path])
            }
            
            return NextResponse.json(
                { error: 'Failed to save portfolio' },
                { status: 500 }
            )
        }

        // STEP 4: Move images to final portfolio folder
        // Handle both newly uploaded images and existing images that need to be moved
        const imagesToMove: string[] = []
        
        // Add newly uploaded images from temp folder
        if (uploadedImagePaths.length > 0) {
            imagesToMove.push(...uploadedImagePaths)
        }
        
        // Add existing images that are in temp or user folders (need to be moved to portfolio folder)
        console.log('📦 Existing image paths:', existingImagePaths)
        console.log('📦 Portfolio ID:', portfolio?.id)
        
        for (const existingPath of existingImagePaths) {
            // Check if image is NOT already in the portfolio folder
            if (!existingPath.startsWith(`${portfolio?.id}/`)) {
                console.log(`📦 Will move: ${existingPath} (doesn't start with ${portfolio?.id}/)`)
                imagesToMove.push(existingPath)
            } else {
                console.log(`📦 Skip move: ${existingPath} (already in portfolio folder)`)
            }
        }
        
        console.log('📦 Images to move:', imagesToMove)
        
        // Move images if needed
        if (imagesToMove.length > 0 && portfolio?.id) {
            for (const sourcePath of imagesToMove) {
                try {
                    // Extract filename
                    const filename = sourcePath.split('/').pop() || ''
                    const targetPath = `${portfolio.id}/${filename}`
                    
                    // Check if source and target are the same
                    if (sourcePath === targetPath) {
                        console.log(`✅ Image already in correct location: ${sourcePath}`)
                        continue
                    }
                    
                    // Move file
                    const { error: moveError } = await serviceRoleClient.storage
                        .from('portfolio-images')
                        .move(sourcePath, targetPath)
                    
                    if (moveError) {
                        console.error(`❌ Failed to move ${sourcePath} to ${targetPath}:`, moveError)
                        throw new Error(`Failed to move image: ${moveError.message}`)
                    }
                    
                    console.log(`✅ Moved ${sourcePath} → ${targetPath}`)
                    
                } catch (error) {
                    console.error('Error moving image:', error)
                    
                    // Cleanup: Delete the portfolio we just created since images failed to move
                    if (portfolio?.id && !existingPortfolio) {
                        await supabase
                            .from('portfolios')
                            .delete()
                            .eq('id', portfolio.id)
                    }
                    
                    return NextResponse.json(
                        { error: `Failed to organize images: ${error instanceof Error ? error.message : 'Unknown error'}` },
                        { status: 500 }
                    )
                }
            }
        }
        
        // Cleanup temp folders
        // Clean up the temp folder from this upload session
        if (uploadedImagePaths.length > 0) {
            await cleanupTempFolder(serviceRoleClient, tempFolder)
        }
        
        // Clean up any old temp folders from existing images
        for (const existingPath of existingImagePaths) {
            if (existingPath.startsWith('temp/')) {
                const tempFolderPath = existingPath.split('/').slice(0, 2).join('/')
                await cleanupTempFolder(serviceRoleClient, tempFolderPath)
            }
        }

        // Link selected tools to portfolio
        if (existingPortfolio) {
            // For UPDATE: First delete existing tool links
            await supabase
                .from('portfolio_tools')
                .delete()
                .eq('portfolio_id', portfolio?.id || '')
        }
        
        if (body.tools && body.tools.length > 0) {
            const toolLinks = body.tools.map(tool => ({
                portfolio_id: portfolio?.id || '',
                tool_id: tool.id,
                created_at: new Date().toISOString()
            }))

            const { error: toolsError } = await supabase
                .from('portfolio_tools')
                .insert(toolLinks)

            if (toolsError) {
                console.error('Error linking tools:', toolsError)
                // Don't fail the entire request for tools error, just log it
            }
        }

        return NextResponse.json({
            success: true,
            portfolio: {
                id: portfolio?.id || '',
                title: portfolio?.title || '',
                status: portfolio?.status || 'pending',
                images: uploadedImagePaths,
                tools: body.tools
            }
        })

    } catch (error) {
        console.error('Upload API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}