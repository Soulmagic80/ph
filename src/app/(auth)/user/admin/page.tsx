"use client"

import AdminEmptyState from "@/components/admin/AdminEmptyState"
import AdminHeader from "@/components/admin/AdminHeader"
import AdminPortfolioTable from "@/components/admin/AdminPortfolioTable"
import { useAuth } from "@/hooks/shared/useAuth"
import { createClient } from "@/lib/supabase"
import { useEffect, useState } from "react"
import { toast } from "sonner"

interface PendingPortfolio {
    id: string
    title: string
    description: string | null
    status: 'pending' | 'approved' | 'declined'
    created_at: string
    updated_at: string
    user: {
        id: string
        username: string | null
        full_name: string | null
    }
    feedback_count?: number
    images: string[]
}

export default function AdminPage() {
    const { user, profile } = useAuth()
    const [portfolios, setPortfolios] = useState<PendingPortfolio[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [processingId, setProcessingId] = useState<string | null>(null)
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

    // Redirect if not admin
    useEffect(() => {
        if (user && profile && !profile.is_admin) {
            window.location.href = '/user/profile'
        }
    }, [user, profile])

    // Fetch pending portfolios
    useEffect(() => {
        fetchPendingPortfolios()
    }, [user, profile])

    const fetchPendingPortfolios = async () => {
        if (!user || !profile?.is_admin) return

        try {
            const supabase = createClient()

            const { data, error } = await supabase
                .from('portfolios')
                .select(`
                    id,
                    title,
                    description,
                    status,
                    created_at,
                    updated_at,
                    images,
                    user:profiles!portfolios_user_id_fkey (
                        id,
                        username,
                        full_name
                    )
                `)
                .eq('status', 'pending')
                .order('created_at', { ascending: false })

            if (error) {
                console.error('Error fetching pending portfolios:', error)
                toast.error('Failed to fetch pending portfolios')
                return
            }

            // Get feedback counts for users (with error handling)
            const userIds = data?.map((p: any) => Array.isArray(p.user) ? p.user[0]?.id : p.user?.id).filter(Boolean) || []
            let feedbackCountMap: Record<string, number> = {}

            console.log('🔍 Looking for feedback counts for user IDs:', userIds)

            if (userIds.length > 0) {
                try {
                    const { data: feedbackCounts, error: feedbackError } = await supabase
                        .from('user_feedback_count')
                        .select('user_id, feedback_count')
                        .in('user_id', userIds)

                    console.log('user_feedback_count query result:', { feedbackData: feedbackCounts, feedbackError })

                    if (feedbackError) {
                        console.error('Error fetching feedback counts:', feedbackError)
                    } else if (feedbackCounts) {
                        feedbackCounts.forEach((fc: any) => {
                            feedbackCountMap[fc.user_id] = fc.feedback_count || 0
                        })
                        console.log('Setting feedback count from user_feedback_count:', feedbackCounts.length)
                    }
                } catch (feedbackFetchError) {
                    console.error('Failed to fetch feedback counts:', feedbackFetchError)
                }
            }

            // Get portfolio count and status for users
            console.log('Fetching portfolio count and status for user:', user.id)
            try {
                const { data: portfolioData, error: portfolioError } = await supabase
                    .from('portfolios')
                    .select('id, status, user_id')
                    .in('user_id', userIds)

                const portfolioCountResult = portfolioData?.length || 0
                console.log('Portfolio query result:', { portfolioData, portfolioCountResult, portfolioError })

                if (portfolioError) {
                    console.error('Error fetching portfolio data:', portfolioError)
                } else {
                    console.log('Setting portfolio count:', portfolioCountResult)
                }
            } catch (portfolioFetchError) {
                console.error('Failed to fetch portfolio data:', portfolioFetchError)
            }

            // Transform data with feedback counts
            const transformedData = data?.map((portfolio: any) => {
                const userId = Array.isArray(portfolio.user) ? portfolio.user[0]?.id : portfolio.user?.id
                return {
                    ...portfolio,
                    user: Array.isArray(portfolio.user) ? portfolio.user[0] : portfolio.user,
                    feedback_count: feedbackCountMap[userId] || 0
                }
            }) || []

            setPortfolios(transformedData)
        } catch (error) {
            console.error('Error in fetchPendingPortfolios:', error)
            toast.error('Failed to fetch pending portfolios')
        } finally {
            setIsLoading(false)
        }
    }


    // Sort portfolios by date
    const sortPortfoliosByDate = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc'
        setSortOrder(newSortOrder)

        const sortedPortfolios = [...portfolios].sort((a, b) => {
            const dateA = new Date(a.created_at).getTime()
            const dateB = new Date(b.created_at).getTime()
            return newSortOrder === 'asc' ? dateA - dateB : dateB - dateA
        })

        setPortfolios(sortedPortfolios)
    }

    if (!profile?.is_admin) {
        return (
            <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                    Access Denied
                </h2>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                    You need admin privileges to access this page.
                </p>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="animate-pulse space-y-6">
                {[1, 2, 3].map(i => (
                    <div key={i} className="border rounded-lg p-6 space-y-4">
                        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                        <div className="flex space-x-3">
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-20"></div>
                        </div>
                    </div>
                ))}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <AdminHeader pendingCount={portfolios.length} />

            {portfolios.length === 0 ? (
                <AdminEmptyState />
            ) : (
                <AdminPortfolioTable
                    portfolios={portfolios}
                    processingId={processingId}
                    onProcessingChange={setProcessingId}
                    onPortfolioUpdate={fetchPendingPortfolios}
                    onSortByDate={sortPortfoliosByDate}
                />
            )}
        </div>
    )
}