import imageCompression from 'browser-image-compression';

export interface OptimizedImage {
  file: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  format: string;
}

export interface OptimizationOptions {
  maxSizeMB: number;
  maxWidthOrHeight: number;
  useWebWorker: boolean;
  fileType?: string;
  initialQuality?: number;
}

const DEFAULT_OPTIONS: OptimizationOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: 'image/webp',
  initialQuality: 0.8
};

export async function optimizeImage(
  file: File, 
  options: Partial<OptimizationOptions> = {}
): Promise<OptimizedImage> {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  
  try {
    const compressedFile = await imageCompression(file, {
      maxSizeMB: opts.maxSizeMB,
      maxWidthOrHeight: opts.maxWidthOrHeight,
      useWebWorker: opts.useWebWorker,
      fileType: opts.fileType,
      initialQuality: opts.initialQuality
    });

    const compressionRatio = ((file.size - compressedFile.size) / file.size) * 100;

    return {
      file: compressedFile,
      originalSize: file.size,
      compressedSize: compressedFile.size,
      compressionRatio: Math.round(compressionRatio),
      format: compressedFile.type
    };
  } catch (error) {
    console.error('Image optimization failed:', error);
    // Return original file if optimization fails
    return {
      file,
      originalSize: file.size,
      compressedSize: file.size,
      compressionRatio: 0,
      format: file.type
    };
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function validateImageAspectRatio(
  width: number, 
  height: number, 
  targetRatio: number = 3/2,
  tolerance: number = 0.1
): boolean {
  const actualRatio = width / height;
  const difference = Math.abs(actualRatio - targetRatio);
  return difference <= tolerance;
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}





