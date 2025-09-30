'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { toast } from 'sonner'

export type AutoSaveStatus = 'idle' | 'saving' | 'saved' | 'error'

interface AutoSaveData {
    title?: string
    websiteUrl?: string
    description?: string
    images?: string[] // Array of image URLs
    tools?: Array<{
        id: string
        name: string
        category: string
    }>
    tags?: string[]
    // Profile-specific fields
    fullName?: string
    location?: string
    website?: string
    bio?: string
    avatarUrl?: string
    services?: Array<{
        id: string
        name: string
        category: string
    }>
}

interface UseAutoSaveOptions {
    debounceMs?: number
    onSave?: (data: AutoSaveData) => Promise<void>
    onError?: (error: Error) => void
    // Customizable toast messages
    savingText?: string
    savedText?: string
    errorText?: string
}

export function useAutoSave({
    debounceMs = 2000,
    onSave,
    onError,
    savingText = 'Saving...',
    savedText = 'Saved',
    errorText = 'Failed to save'
}: UseAutoSaveOptions = {}) {
    const [status, setStatus] = useState<AutoSaveStatus>('idle')
    const [lastSaved, setLastSaved] = useState<Date | null>(null)
    
    const timeoutRef = useRef<NodeJS.Timeout>()
    const currentDataRef = useRef<AutoSaveData>({})
    const isSavingRef = useRef(false)

    // Save function
    const save = useCallback(async (data: AutoSaveData) => {
        if (isSavingRef.current) return
        
        try {
            isSavingRef.current = true
            setStatus('saving')
            
            // Show saving toast
            toast.loading(savingText, { id: 'autosave' })

            if (onSave) {
                await onSave(data)
            } else {
                // Default save to API
                const response = await fetch('/api/portfolios/draft', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                })
                
                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.error || 'Save failed')
                }
            }

            setStatus('saved')
            setLastSaved(new Date())
            
            // Show success toast
            toast.success(savedText, { id: 'autosave' })
            
            // Auto-hide saved status after 3 seconds
            setTimeout(() => {
                setStatus('idle')
            }, 3000)

        } catch (error) {
            console.error('Auto-save error:', error)
            setStatus('error')
            
            // Show error toast
            toast.error(errorText, { id: 'autosave' })
            
            if (onError) {
                onError(error instanceof Error ? error : new Error('Save failed'))
            }
            
            // Auto-hide error status after 5 seconds
            setTimeout(() => {
                setStatus('idle')
            }, 5000)
            
        } finally {
            isSavingRef.current = false
        }
    }, [onSave, onError])

    // Debounced save function
    const debouncedSave = useCallback((data: AutoSaveData) => {
        // Clear existing timeout
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }

        // Update current data
        currentDataRef.current = { ...currentDataRef.current, ...data }

        // Only save if there's meaningful content
        const hasContent = Boolean(
            currentDataRef.current.title?.trim() ||
            currentDataRef.current.description?.trim() ||
            (currentDataRef.current.tools && currentDataRef.current.tools.length > 0) ||
            (currentDataRef.current.tags && currentDataRef.current.tags.length > 0) ||
            currentDataRef.current.fullName?.trim() ||
            currentDataRef.current.location?.trim() ||
            currentDataRef.current.website?.trim() ||
            currentDataRef.current.bio?.trim() ||
            currentDataRef.current.avatarUrl?.trim() ||
            (currentDataRef.current.services && currentDataRef.current.services.length > 0)
        )

        if (!hasContent) {
            return
        }

        // Set new timeout
        timeoutRef.current = setTimeout(() => {
            save(currentDataRef.current)
        }, debounceMs)

    }, [save, debounceMs])

    // Manual save (immediate)
    const saveNow = useCallback(() => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current)
        }
        save(currentDataRef.current)
    }, [save])

    // Update data without triggering save
    const updateData = useCallback((data: Partial<AutoSaveData>) => {
        currentDataRef.current = { ...currentDataRef.current, ...data }
    }, [])

    // Trigger auto-save
    const triggerSave = useCallback((data: Partial<AutoSaveData>) => {
        debouncedSave(data)
    }, [debouncedSave])

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current)
            }
        }
    }, [])

    return {
        status,
        lastSaved,
        triggerSave,
        saveNow,
        updateData,
        isIdle: status === 'idle',
        isSaving: status === 'saving',
        isSaved: status === 'saved',
        hasError: status === 'error'
    }
}


