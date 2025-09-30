'use client'

import { useAuth } from '@/hooks/shared/useAuth'
import { getPortfolioImageUrl } from '@/lib/imageUtils'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@tremor/react'
import { AlertCircle, Calendar, CheckCircle, Clock, Edit3, Eye, XCircle } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Portfolio {
    id: string
    title: string
    description: string
    status: 'draft' | 'pending' | 'approved' | 'declined'
    approved: boolean | null
    published: boolean | null
    declined_reason: string | null
    created_at: string
    updated_at: string
    images: string[]
    tags: string[]
}

export default function StatusPage() {
    const { user } = useAuth()
    const [portfolio, setPortfolio] = useState<Portfolio | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!user) return

        const fetchUserPortfolio = async () => {
            try {
                const supabase = createClient()
                const { data, error } = await supabase
                    .from('portfolios')
                    .select('*')
                    .eq('user_id', user.id)
                    .single()

                if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
                    throw error
                }

                setPortfolio(data || null)
            } catch (err) {
                console.error('Error fetching portfolio:', err)
                setError('Failed to load portfolio status')
                toast.error('Failed to load portfolio status')
            } finally {
                setLoading(false)
            }
        }

        fetchUserPortfolio()
    }, [user])

    const getStatusBadge = (status: string, _approved: boolean | null, published: boolean | null) => {
        if (status === 'draft') {
            return <Badge color="gray" icon={Edit3}>Draft</Badge>
        }
        if (status === 'pending') {
            return <Badge color="yellow" icon={Clock}>Pending Review</Badge>
        }
        if (status === 'declined') {
            return <Badge color="red" icon={XCircle}>Declined</Badge>
        }
        if (status === 'approved' && !published) {
            return <Badge color="blue" icon={AlertCircle}>Approved - Publishing Soon</Badge>
        }
        if (status === 'approved' && published) {
            return <Badge color="green" icon={CheckCircle}>Published</Badge>
        }
        return <Badge color="gray">Unknown</Badge>
    }

    const getStatusMessage = (status: string, _approved: boolean | null, published: boolean | null) => {
        if (status === 'draft') {
            return 'Your portfolio is saved as a draft. Continue editing to submit it for review.'
        }
        if (status === 'pending') {
            return 'Your portfolio is under review. We\'ll notify you once it\'s been reviewed.'
        }
        if (status === 'declined') {
            return 'Your portfolio needs some adjustments. Please review the feedback and resubmit.'
        }
        if (status === 'approved' && !published) {
            return 'Great! Your portfolio has been approved and will be published on the next Sunday.'
        }
        if (status === 'approved' && published) {
            return 'Congratulations! Your portfolio is live and visible to everyone.'
        }
        return 'Status unknown'
    }

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="animate-pulse">
                    <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="bg-white rounded-lg border p-6">
                        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                    <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-lg font-semibold text-red-900 mb-2">Error Loading Status</h2>
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        )
    }

    if (!portfolio) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Portfolio Status</h1>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
                    <AlertCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-blue-900 mb-2">No Portfolio Yet</h2>
                    <p className="text-blue-700 mb-6">
                        You haven&apos;t uploaded a portfolio yet. Ready to showcase your work?
                    </p>
                    <Link
                        href="/user/upload"
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Edit3 className="w-4 h-4 mr-2" />
                        Create Portfolio
                    </Link>
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Portfolio Status</h1>

            <div className="bg-white rounded-lg border shadow-sm">
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                {portfolio.title}
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {portfolio.description}
                            </p>
                            <div className="flex items-center gap-4 text-sm text-gray-500">
                                <div className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Created: {new Date(portfolio.created_at).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    Updated: {new Date(portfolio.updated_at).toLocaleDateString()}
                                </div>
                            </div>
                        </div>
                        <div className="ml-4">
                            {getStatusBadge(portfolio.status, portfolio.approved, portfolio.published)}
                        </div>
                    </div>
                </div>

                {/* Status Message */}
                <div className="p-6 border-b bg-gray-50">
                    <p className="text-gray-700">
                        {getStatusMessage(portfolio.status, portfolio.approved, portfolio.published)}
                    </p>

                    {portfolio.status === 'declined' && portfolio.declined_reason && (
                        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                            <h4 className="font-semibold text-red-900 mb-2">Feedback:</h4>
                            <p className="text-red-800">{portfolio.declined_reason}</p>
                        </div>
                    )}
                </div>

                {/* Portfolio Preview */}
                <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Portfolio Preview</h3>

                    {/* Images */}
                    {portfolio.images && portfolio.images.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Images ({portfolio.images.length})</h4>
                            <div className="flex gap-2 flex-wrap">
                                {portfolio.images.slice(0, 4).map((image, index) => {
                                    const imageUrl = getPortfolioImageUrl(portfolio.id, image);
                                    return (
                                        <img
                                            key={index}
                                            src={imageUrl}
                                            alt={`Portfolio image ${index + 1}`}
                                            className="w-16 h-16 object-cover rounded border"
                                        />
                                    );
                                })}
                                {portfolio.images.length > 4 && (
                                    <div className="w-16 h-16 bg-gray-100 rounded border flex items-center justify-center text-xs text-gray-500">
                                        +{portfolio.images.length - 4}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tags */}
                    {portfolio.tags && portfolio.tags.length > 0 && (
                        <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 mb-2">Tags</h4>
                            <div className="flex gap-2 flex-wrap">
                                {portfolio.tags.map((tag, index) => (
                                    <span
                                        key={index}
                                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="p-6 border-t bg-gray-50">
                    <div className="flex gap-3">
                        {(portfolio.status === 'draft' || portfolio.status === 'declined') && (
                            <Link
                                href="/user/upload"
                                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Edit3 className="w-4 h-4 mr-2" />
                                Continue Editing
                            </Link>
                        )}

                        {portfolio.published && (
                            <Link
                                href={`/${portfolio.id}`}
                                className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                <Eye className="w-4 h-4 mr-2" />
                                View Published
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
