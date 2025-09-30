import { getSupabaseServer } from '@/lib/supabase-server'
import { createClient } from '@supabase/supabase-js'
// Fix for Supabase + Next.js 15 Edge Runtime conflict
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'

// Service role client for storage operations
const serviceRoleClient = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
)

interface ImageUploadRequest {
    file: string // base64 encoded file data
    fileName: string
    contentType: string
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

        const body: ImageUploadRequest = await _request.json()
        
        // Validate required fields
        if (!body.file || !body.fileName || !body.contentType) {
            return NextResponse.json(
                { error: 'Missing required fields: file, fileName, contentType' },
                { status: 400 }
            )
        }

        // Validate file type
        if (!body.contentType.startsWith('image/')) {
            return NextResponse.json(
                { error: 'Only image files are allowed' },
                { status: 400 }
            )
        }

        try {
            // Convert base64 to buffer
            const base64Data = body.file.split(',')[1] // Remove data:image/jpeg;base64, prefix
            const buffer = Buffer.from(base64Data, 'base64')
            
            // Generate unique filename
            const timestamp = Date.now()
            const randomString = Math.random().toString(36).substring(2, 15)
            const fileExtension = body.fileName.split('.').pop()
            const uniqueFileName = `${user.id}/${timestamp}_${randomString}.${fileExtension}`
            
            // Upload to Supabase Storage
            const { error: uploadError } = await serviceRoleClient.storage
                .from('portfolio-images')
                .upload(uniqueFileName, buffer, {
                    contentType: body.contentType,
                    cacheControl: '3600',
                    upsert: false
                })

            if (uploadError) {
                console.error('Storage upload error:', uploadError)
                return NextResponse.json(
                    { error: 'Failed to upload image to storage' },
                    { status: 500 }
                )
            }

            // Get public URL
            const { data: { publicUrl } } = serviceRoleClient.storage
                .from('portfolio-images')
                .getPublicUrl(uniqueFileName)


            return NextResponse.json({
                success: true,
                url: publicUrl, // Changed from imageUrl to url
                imageUrl: publicUrl, // Keep both for compatibility
                storagePath: uniqueFileName
            })

        } catch (error) {
            console.error('Error processing image:', error)
            return NextResponse.json(
                { error: 'Failed to process image' },
                { status: 500 }
            )
        }

    } catch (error) {
        console.error('Image upload API error:', error)
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        )
    }
}
