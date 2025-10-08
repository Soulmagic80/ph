'use client'

import { Clock, CheckCircle2, XCircle, EyeOff } from 'lucide-react'

interface StatusBadgeProps {
    status: 'draft' | 'pending' | 'approved' | 'published' | 'declined'
    published?: boolean
    isVisible?: boolean
}

export function StatusBadge({ status, published = false, isVisible = true }: StatusBadgeProps) {
    // Determine badge text and styling based on status
    const getBadgeConfig = () => {
        switch (status) {
            case 'pending':
                return {
                    text: 'PENDING APPROVAL',
                    icon: Clock,
                    className: 'bg-orange-50 text-orange-900 ring-orange-500/30 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/30'
                }
            
            case 'approved':
                if (published && isVisible) {
                    return {
                        text: 'PUBLISHED',
                        icon: CheckCircle2,
                        className: 'bg-blue-50 text-blue-900 ring-blue-500/30 dark:bg-blue-400/10 dark:text-blue-400 dark:ring-blue-400/30'
                    }
                } else if (published && !isVisible) {
                    return {
                        text: 'OFFLINE FOR CHANGES',
                        icon: EyeOff,
                        className: 'bg-orange-50 text-orange-900 ring-orange-500/30 dark:bg-orange-400/10 dark:text-orange-400 dark:ring-orange-400/30'
                    }
                } else {
                    return {
                        text: 'APPROVED - IN QUEUE',
                        icon: CheckCircle2,
                        className: 'bg-green-50 text-green-900 ring-green-500/30 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/30'
                    }
                }
            
            case 'declined':
                return {
                    text: 'DECLINED',
                    icon: XCircle,
                    className: 'bg-red-50 text-red-900 ring-red-500/30 dark:bg-red-400/10 dark:text-red-400 dark:ring-red-400/30'
                }
            
            case 'draft':
            default:
                return null
        }
    }

    const config = getBadgeConfig()

    if (!config) return null

    const Icon = config.icon

    return (
        <div className={`inline-flex items-center px-2 py-1 mt-3 rounded text-xs font-medium ring-1 ${config.className}`}>
            <Icon className="w-3 h-3 mr-1.5" />
            {config.text}
        </div>
    )
}
