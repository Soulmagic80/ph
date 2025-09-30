'use client'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Check, File, Upload, X } from 'lucide-react'
import { useRef, useState } from 'react'

interface PortfolioFile {
    id: string
    name: string
    size: number
    type: string
    url?: string
}

interface ProfilePortfolioUploadProps {
    files: PortfolioFile[]
    onFilesChange: (files: PortfolioFile[]) => void
    maxFiles?: number
    maxFileSize?: number // in MB
    acceptedTypes?: string[]
}

export default function ProfilePortfolioUpload({
    files,
    onFilesChange,
    maxFiles = 5,
    maxFileSize = 10, // 10MB
    acceptedTypes = ['.pdf', '.doc', '.docx', '.txt', '.md']
}: ProfilePortfolioUploadProps) {
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFiles = event.target.files
        if (!selectedFiles) return

        setError(null)
        setIsUploading(true)

        // Validate file count
        if (files.length + selectedFiles.length > maxFiles) {
            setError(`Maximum ${maxFiles} files allowed`)
            setIsUploading(false)
            return
        }

        const newFiles: PortfolioFile[] = []

        Array.from(selectedFiles).forEach((file) => {
            // Validate file size
            if (file.size > maxFileSize * 1024 * 1024) {
                setError(`File ${file.name} is too large. Maximum size is ${maxFileSize}MB`)
                return
            }

            // Validate file type
            const fileExtension = '.' + file.name.split('.').pop()?.toLowerCase()
            if (!acceptedTypes.includes(fileExtension)) {
                setError(`File type ${fileExtension} is not supported`)
                return
            }

            const newFile: PortfolioFile = {
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                size: file.size,
                type: file.type
            }

            newFiles.push(newFile)
        })

        if (newFiles.length > 0) {
            onFilesChange([...files, ...newFiles])
        }

        setIsUploading(false)

        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = ''
        }
    }

    const handleRemoveFile = (fileId: string) => {
        onFilesChange(files.filter(f => f.id !== fileId))
    }

    const formatFileSize = (bytes: number) => {
        if (bytes === 0) return '0 Bytes'
        const k = 1024
        const sizes = ['Bytes', 'KB', 'MB', 'GB']
        const i = Math.floor(Math.log(bytes) / Math.log(k))
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    return (
        <section aria-labelledby="profile-portfolio-upload-heading">
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                <div>
                    <h2
                        id="profile-portfolio-upload-heading"
                        className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
                    >
                        Portfolio Files
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Upload documents and files to showcase your work.
                    </p>
                </div>
                <div className="md:col-span-2 md:pl-24">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <Button
                                variant="secondary"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading || files.length >= maxFiles}
                                className="flex items-center gap-2"
                            >
                                <Upload className="h-4 w-4" />
                                Upload Files
                            </Button>
                        </div>

                        <input
                            ref={fileInputRef}
                            type="file"
                            multiple
                            accept={acceptedTypes.join(',')}
                            onChange={handleFileSelect}
                            className="hidden"
                        />

                        {/* Error Message */}
                        {error && (
                            <div className="text-sm text-red-600 bg-red-50 p-2 rounded-md">
                                {error}
                            </div>
                        )}

                        {/* File List */}
                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">
                                Uploaded Files ({files.length}/{maxFiles})
                            </h4>

                            {files.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No files uploaded yet</p>
                            ) : (
                                <div className="space-y-2">
                                    {files.map((file) => (
                                        <div
                                            key={file.id}
                                            className="flex items-center justify-between p-3 border rounded-md bg-gray-50"
                                        >
                                            <div className="flex items-center gap-3">
                                                <File className="h-5 w-5 text-gray-500" />
                                                <div>
                                                    <p className="text-sm font-medium">{file.name}</p>
                                                    <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {file.url && (
                                                    <Badge variant="success" className="flex items-center gap-1">
                                                        <Check className="h-3 w-3" />
                                                        Uploaded
                                                    </Badge>
                                                )}
                                                <button
                                                    onClick={() => handleRemoveFile(file.id)}
                                                    className="text-gray-400 hover:text-red-500"
                                                >
                                                    <X className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Upload Info */}
                        <div className="text-xs text-gray-500 space-y-1">
                            <p>Accepted formats: {acceptedTypes.join(', ')}</p>
                            <p>Maximum file size: {maxFileSize}MB</p>
                            <p>Maximum files: {maxFiles}</p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
} 