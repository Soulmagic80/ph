/**
 * Centralized Image Utilities for Portfolio Images
 * 
 * Best Practice: Folder Structure
 * Storage: /portfolio-images/{portfolio_id}/{filename}
 * Database: portfolios.images = ["main.jpg", "1.png", "2.webp"]
 */

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const STORAGE_BUCKET = 'portfolio-images';

// Helper function to normalize website URLs
export function normalizeWebsiteUrl(url: string): string {
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

/**
 * Generate full image URL from portfolio ID and filename
 * BACKWARD COMPATIBLE: Supports both old flat structure and new folder structure
 */
export function getPortfolioImageUrl(portfolioId: string, filename: string): string {
    if (!portfolioId || !filename) {
        console.warn('getPortfolioImageUrl: Missing portfolioId or filename', { portfolioId, filename });
        return '';
    }

    // Check if filename is already a full URL
    if (filename.startsWith('http://') || filename.startsWith('https://')) {
        return filename;
    }

    // If filename contains a slash, it's already a full path (e.g., "user_id/file.jpg")
    // Don't prepend portfolio_id
    if (filename.includes('/')) {
        return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${filename}`;
    }

    // CURRENT SYSTEM: All images are stored in portfolio folders
    // Format: portfolio-images/{portfolio_id}/{filename}
    // The filename can be: main.jpg, 1.png, 2.webp, OR timestamp_random.webp
    return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${portfolioId}/${filename}`;
}

/**
 * Generate storage path for uploading to temporary folder
 */
export function getTempImagePath(userId: string, index: number, fileExtension: string): string {
    const timestamp = Date.now();
    const filename = index === 0 ? `main.${fileExtension}` : `${index}.${fileExtension}`;
    return `temp/${userId}_${timestamp}/${filename}`;
}

/**
 * Generate final storage path for portfolio
 */
export function getPortfolioImagePath(portfolioId: string, index: number, fileExtension: string): string {
    // First image is always "main", others are numbered
    const filename = index === 0 ? `main.${fileExtension}` : `${index}.${fileExtension}`;
    return `${portfolioId}/${filename}`;
}

/**
 * Generate temp folder name for user
 */
export function getTempFolderName(userId: string): string {
    return `temp/${userId}_${Date.now()}`;
}

/**
 * Extract filename from storage path
 */
export function extractFilenameFromPath(storagePath: string): string {
    return storagePath.split('/').pop() || '';
}

/**
 * Validate image filename format
 */
export function isValidImageFilename(filename: string): boolean {
    if (!filename) return false;
    
    // Check for proper extension
    const hasValidExtension = /\.(jpg|jpeg|png|webp)$/i.test(filename);
    
    // Check it's not empty or just a dot
    const isNotEmpty = filename.length > 4 && !filename.endsWith('.');
    
    return hasValidExtension && isNotEmpty;
}

/**
 * Get main image URL for portfolio cards
 */
export function getPortfolioMainImageUrl(portfolio: { id: string; images?: string[] | null }): string | null {
    if (!portfolio.images || portfolio.images.length === 0) {
        return null;
    }

    const mainImage = portfolio.images[0];
    if (!isValidImageFilename(mainImage)) {
        console.warn('Invalid main image filename:', mainImage);
        return null;
    }

    return getPortfolioImageUrl(portfolio.id, mainImage);
}

/**
 * Move images from temp folder to final portfolio folder
 */
export async function moveImagesToPortfolioFolder(
    supabaseClient: any,
    tempFolderPath: string,
    portfolioId: string,
    imageFilenames: string[]
): Promise<{ success: boolean; finalPaths: string[]; error?: string }> {
    const finalPaths: string[] = [];
    
    try {
        for (let i = 0; i < imageFilenames.length; i++) {
            const filename = imageFilenames[i];
            const tempPath = `${tempFolderPath}/${filename}`;
            const finalPath = `${portfolioId}/${filename}`;
            
            // Move file from temp to final location
            const { error: moveError } = await supabaseClient.storage
                .from('portfolio-images')
                .move(tempPath, finalPath);
                
            if (moveError) {
                console.error(`Error moving ${tempPath} to ${finalPath}:`, moveError);
                throw new Error(`Failed to move image ${filename}: ${moveError.message}`);
            }
            
            finalPaths.push(finalPath);
        }
        
        return { success: true, finalPaths };
    } catch (error) {
        return { 
            success: false, 
            finalPaths: [], 
            error: error instanceof Error ? error.message : 'Unknown error' 
        };
    }
}

/**
 * Cleanup temp folder after successful move
 */
export async function cleanupTempFolder(supabaseClient: any, tempFolderPath: string): Promise<void> {
    try {
        // List all files in temp folder
        const { data: files, error: listError } = await supabaseClient.storage
            .from('portfolio-images')
            .list(tempFolderPath);
            
        if (listError || !files) {
            console.warn('Could not list temp folder for cleanup:', listError);
            return;
        }
        
        // Remove all files in temp folder
        const filePaths = files.map((file: any) => `${tempFolderPath}/${file.name}`);
        if (filePaths.length > 0) {
            const { error: removeError } = await supabaseClient.storage
                .from('portfolio-images')
                .remove(filePaths);
                
            if (removeError) {
                console.warn('Could not cleanup temp folder:', removeError);
            }
        }
    } catch (error) {
        console.warn('Error during temp folder cleanup:', error);
    }
}

/**
 * Debug helper to log image processing
 */
export function debugImagePath(context: string, portfolioId: string, filename: string, url: string) {
    if (process.env.NODE_ENV === 'development') {
        console.log(`🖼️ ${context}:`, {
            portfolioId,
            filename,
            url,
            isValid: isValidImageFilename(filename)
        });
    }
}
