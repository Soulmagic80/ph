'use client'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { usePortfolioStatus } from '@/hooks/portfolio/usePortfolioStatus'
import { createClient } from '@/lib/supabase/client'
import { User } from '@supabase/supabase-js'
import { AlertCircle, Eye, RotateCcw, Save, Send, Trash2, Upload } from 'lucide-react'
import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import { SaveConfirmModal } from './SaveConfirmModal'

interface UploadRestrictionsProps {
    user: User | null
    onCanUpload: (canUpload: boolean) => void
    isSubmitting?: boolean
    onSubmit?: () => void
    onClearAll?: () => void
    onPreview?: () => void
    onDelete?: () => void
    refreshTrigger?: number
    formData?: {
        title: string
        websiteUrl: string
        images: any[]
    }
    portfolioStatus?: {
        status: string
        canSubmit: boolean
        canPreview: boolean
        canClearAll: boolean
        canEdit: boolean
        showEditButton: boolean
        showWithdrawButton: boolean
        statusMessage: string
        isLoading: boolean
    }
    onStatusChange?: () => void
}

export default function UploadRestrictions({
    user,
    onCanUpload,
    isSubmitting = false,
    onSubmit,
    onClearAll,
    onPreview,
    onDelete,
    refreshTrigger,
    formData,
    portfolioStatus,
    onStatusChange
}: UploadRestrictionsProps) {
    const [feedbackCount, setFeedbackCount] = useState(0)
    const [isAdmin, setIsAdmin] = useState(false)
    const [isLoadingRestrictions, setIsLoadingRestrictions] = useState(true)
    const [showSaveModal, setShowSaveModal] = useState(false)
    const [isSaving, setIsSaving] = useState(false)

    // Use passed portfolio status or fallback to hook
    const fallbackStatus = usePortfolioStatus()
    const {
        status,
        approved: _approved,
        published,
        is_visible,
        canSubmit,
        canPreview,
        canClearAll,
        canEdit: _canEdit,
        showWithdrawButton,
        isLoading: isStatusLoading,
        error: statusError,
        withdrawPortfolio,
        resubmitPortfolio,
        refetch: refetchStatus
    } = portfolioStatus ? {
        ...portfolioStatus,
        approved: fallbackStatus.approved,
        published: fallbackStatus.published,
        is_visible: fallbackStatus.is_visible,
        error: null,
        withdrawPortfolio: fallbackStatus.withdrawPortfolio,
        resubmitPortfolio: fallbackStatus.resubmitPortfolio,
        refetch: fallbackStatus.refetch
    } : fallbackStatus

    // 🔍 DEBUG: Log portfolio status capabilities
    console.log('🎯 UploadRestrictions - Status Capabilities:', {
        status,
        canSubmit,
        canPreview,
        canClearAll,
        showWithdrawButton,
        hasCallbacks: {
            onSubmit: !!onSubmit,
            onPreview: !!onPreview,
            onClearAll: !!onClearAll
        }
    })

    const supabase = useMemo(() => createClient(), [])

    const REQUIRED_FEEDBACK = 5

    // Check admin status and feedback requirements
    const fetchRestrictions = useCallback(async () => {
        if (!user) {
            setIsLoadingRestrictions(false)
            return
        }

        setIsLoadingRestrictions(true)

        try {
            // Check if user is admin
            const { data: profile, error: profileError } = await supabase
                .from('profiles')
                .select('is_admin')
                .eq('id', user.id)
                .single()

            if (profileError) {
                console.error('Error checking admin status:', profileError)
            } else {
                setIsAdmin(profile?.is_admin || false)
            }

            // Get feedback count for non-admin users
            if (!profile?.is_admin) {
                const { data: feedbackData, error: feedbackError } = await supabase
                    .from('user_feedback_count')
                    .select('count')
                    .eq('user_id', user.id)
                    .single()

                if (feedbackError) {
                    // Fallback: count directly from feedback_status
                    const { count: directCount, error: directError } = await supabase
                        .from('feedback_status')
                        .select('*', { count: 'exact', head: true })
                        .eq('user_id', user.id)
                        .eq('status', 'completed')

                    if (directError) {
                        console.error('Failed to get feedback count:', directError)
                        setFeedbackCount(0)
                    } else {
                        setFeedbackCount(directCount || 0)
                    }
                } else {
                    setFeedbackCount(feedbackData?.count || 0)
                }
            }
        } catch (error) {
            console.error('Error fetching restrictions:', error)
        } finally {
            setIsLoadingRestrictions(false)
        }
    }, [user, supabase])

    // Fetch restrictions on mount and when refreshTrigger changes
    useEffect(() => {
        fetchRestrictions()
    }, [fetchRestrictions, refreshTrigger])

    // Determine if user can upload based on feedback requirements
    const hasSufficientFeedback = useMemo(() => {
        return isAdmin || feedbackCount >= REQUIRED_FEEDBACK
    }, [isAdmin, feedbackCount])

    // Form validation for current form data
    const hasValidForm = useMemo(() => {
        if (!formData) return false

        const hasValidImages = formData.images.length > 0 &&
            formData.images.some(img => img && (img.url || img.uploaded))

        const isValid = (
            formData.title.trim().length > 0 &&
            formData.websiteUrl.trim().length > 0 &&
            hasValidImages
        )

        // 🔍 DEBUG: Log form validation
        console.log('📝 UploadRestrictions - Form Validation:', {
            hasFormData: !!formData,
            title: formData?.title || '',
            websiteUrl: formData?.websiteUrl || '',
            imageCount: formData?.images.length || 0,
            hasValidImages,
            isValid
        })

        return isValid
    }, [formData])

    // Final canUpload determination
    const canUpload = useMemo(() => {
        if (isAdmin) {
            return hasValidForm // Admins just need valid form
        }

        // Normal users need feedback + valid form + ability to submit from status
        return hasSufficientFeedback && hasValidForm && canSubmit
    }, [isAdmin, hasValidForm, hasSufficientFeedback, canSubmit])

    // Notify parent component when canUpload changes
    useEffect(() => {
        onCanUpload(canUpload)
    }, [canUpload, onCanUpload])


    // Handle resubmit action (for declined portfolios)
    const handleResubmit = async () => {
        try {
            const result = await resubmitPortfolio()
            if (result.success) {
                toast.success('Portfolio resubmitted for review')
                refetchStatus() // Refresh status
            } else {
                toast.error(result.error || 'Failed to resubmit portfolio')
            }
        } catch (error) {
            toast.error('Failed to resubmit portfolio')
        }
    }

    // Handle save & publish (for published offline portfolios)
    const handleSaveAndPublish = async () => {
        setIsSaving(true)
        try {
            const response = await fetch('/api/portfolios/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            })

            const result = await response.json()

            if (response.ok && result.success) {
                toast.success('Portfolio published successfully!')
                setShowSaveModal(false)
                await refetchStatus()
                onStatusChange?.()
            } else {
                toast.error(result.error || 'Failed to publish portfolio')
            }
        } catch (error) {
            console.error('Error publishing portfolio:', error)
            toast.error('Failed to publish portfolio')
        } finally {
            setIsSaving(false)
        }
    }


    if (!user) {
        return (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="text-center">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-gray-50 mb-2">
                        Sign in to Upload
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        You need to be signed in to upload portfolios.
                    </p>
                </div>
            </div>
        )
    }

    if (isLoadingRestrictions || isStatusLoading) {
        return (
            <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4"></div>
                    <div className="space-y-2">
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (statusError) {
        return (
            <div className="border border-red-200 dark:border-red-700 rounded-lg p-6">
                <div className="text-center">
                    <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-red-900 dark:text-red-50 mb-2">
                        Error Loading Status
                    </h3>
                    <p className="text-red-600 dark:text-red-400 mb-4">
                        {statusError}
                    </p>
                    <Button onClick={refetchStatus} variant="secondary">
                        Try Again
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <section aria-labelledby="actions-heading">
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                    <div>
                        <h2
                            id="actions-heading"
                            className="heading-section"
                        >
                            Portfolio Actions
                        </h2>
                        <p className="text-small mt-2">
                        {isAdmin
                            ? "As an admin, you can upload portfolios without restrictions."
                            : "Manage your portfolio submission with the available actions below."
                        }
                    </p>
                </div>
                <div className="md:col-span-2 md:pl-16">
                    <div id="portfolio-actions" className="space-y-6 scroll-mt-20">
                        {/* 🔍 DEBUG: Log render conditions */}
                        {(() => {
                            console.log('🎨 UploadRestrictions - Render Check:', {
                                willRenderClearAll: canClearAll && !!onClearAll,
                                willRenderPreview: canPreview && !!onPreview,
                                willRenderSubmit: (canSubmit || isAdmin) && !!onSubmit,
                                willRenderWithdraw: showWithdrawButton
                            });
                            return null;
                        })()}
                        
                        {/* Admin Badge */}
                        {isAdmin && (
                            <div className="border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
                                <div className="flex items-center gap-5">
                                    <Badge variant="success">
                                        Admin
                                    </Badge>
                                    <div>
                                        <h3 className="text-sm font-medium text-green-900 dark:text-green-100">
                                            Admin Access
                                        </h3>
                                        <p className="mt-1 text-sm text-green-700 dark:text-green-300">
                                            You have unrestricted upload privileges.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}



                        {/* Clear All Card */}
                        {canClearAll && onClearAll && (
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                                <div className="flex items-center gap-5">
                                    <RotateCcw size={17} className="flex-shrink-0 text-gray-400" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                            Clear All Data
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Remove all form data and uploaded images to start fresh.
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    onClick={onClearAll}
                                    disabled={isSubmitting}
                                    variant="secondary"
                                >
                                    Clear All
                                </Button>
                            </div>
                        )}

                        {/* Withdraw Card - For pending, approved (in queue), and published */}
                        {showWithdrawButton && (
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                                <div className="flex items-center gap-5">
                                    <RotateCcw size={17} className="flex-shrink-0 text-gray-400" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                            Withdraw Portfolio
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {status === 'pending' 
                                                ? 'Withdraw your portfolio from review to make changes.'
                                                : 'Withdraw your portfolio from public view to make changes.'
                                            }
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    onClick={async () => {
                                        try {
                                            const result = await withdrawPortfolio();
                                            if (result.success) {
                                                toast.success('Portfolio withdrawn! You can now edit it.');
                                                await refetchStatus(); // Refresh status to update UI
                                                onStatusChange?.(); // Notify parent component
                                            } else {
                                                toast.error(result.error || 'Failed to withdraw portfolio');
                                            }
                                        } catch (error) {
                                            toast.error('Failed to withdraw portfolio');
                                        }
                                    }}
                                    disabled={isSubmitting}
                                    variant="secondary"
                                >
                                    <RotateCcw className="w-4 h-4 mr-2" />
                                    Withdraw
                                </Button>
                            </div>
                        )}

                        {/* Preview Card */}
                        {canPreview && onPreview && (
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                                <div className="flex items-center gap-5">
                                    <Eye size={17} className="flex-shrink-0 text-gray-400" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                            Preview Portfolio
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            See how your portfolio will look to visitors.
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    onClick={onPreview}
                                    disabled={isSubmitting}
                                    variant="secondary"
                                >
                                    Preview
                                </Button>
                            </div>
                        )}

                        {/* Save & Publish Card - For published (offline) portfolios */}
                        {status === 'approved' && published && !is_visible && (
                            <div className="flex items-center justify-between rounded-lg border border-blue-200 p-4 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                                <div className="flex items-center gap-5">
                                    <Save size={17} className="flex-shrink-0 text-blue-600 dark:text-blue-400" />
                                    <div>
                                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-50">
                                            Save & Publish
                                        </h3>
                                        <p className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                                            Your portfolio is currently offline. Save your changes to publish it live.
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    onClick={() => setShowSaveModal(true)}
                                    disabled={isSubmitting || isSaving}
                                    variant="primary"
                                >
                                    {isSaving ? 'Publishing...' : 'Save & Publish'}
                                </Button>
                            </div>
                        )}

                        {/* Submit Card */}
                        {(canSubmit || isAdmin) && onSubmit && (
                            <div className="flex items-center justify-between rounded-lg border border-gray-200 p-4 dark:border-gray-800">
                                <div className="flex items-center gap-5">
                                    <Send size={17} className="flex-shrink-0 text-gray-400" />
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                            {status === 'declined' ? 'Resubmit Portfolio' : 'Submit Portfolio'}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {canUpload
                                                ? (status === 'declined'
                                                    ? "Your portfolio is ready to be resubmitted for review."
                                                    : "Your portfolio is ready to be submitted for review."
                                                )
                                                : (
                                                    <>
                                                        Meet requirements to submit.{' '}
                                                        <Link
                                                            href="/portfolio/overview"
                                                            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
                                                        >
                                                            Check status overview
                                                        </Link>
                                                    </>
                                                )
                                            }
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    onClick={status === 'declined' ? handleResubmit : onSubmit}
                                    disabled={!canUpload || isSubmitting}
                                    variant={canUpload ? "primary" : "secondary"}
                                >
                                    {isSubmitting
                                        ? 'Uploading...'
                                        : status === 'declined'
                                            ? 'Resubmit'
                                            : 'Submit'
                                    }
                                </Button>
                            </div>
                        )}

                        {/* Delete Portfolio Card */}
                        {status !== 'none' && status !== 'draft' && onDelete && (
                            <div className="flex items-center justify-between rounded-lg border border-red-200 p-4 dark:border-red-800">
                                <div className="flex items-center gap-5">
                                    <Trash2 size={19} className="flex-shrink-0 text-red-400" />
                                    <div>
                                        <h3 className="text-sm font-medium text-red-900 dark:text-red-50">
                                            Delete Portfolio
                                        </h3>
                                        <p className="mt-1 text-sm text-red-700 dark:text-red-300">
                                            Permanently delete your portfolio.
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    type="button"
                                    onClick={onDelete}
                                    disabled={isSubmitting}
                                    variant="destructive"
                                    className="bg-red-600 hover:bg-red-700 text-white"
                                >
                                    Delete Portfolio
                                </Button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Save Confirmation Modal */}
            <SaveConfirmModal
                isOpen={showSaveModal}
                onClose={() => setShowSaveModal(false)}
                onConfirm={handleSaveAndPublish}
                isLoading={isSaving}
            />
        </section>
    )
}