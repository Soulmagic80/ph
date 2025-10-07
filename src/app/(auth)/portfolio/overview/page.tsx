"use client";

import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { useRandomPortfolio } from "@/hooks/feedback/useRandomPortfolio";
import { usePortfolioStatus } from "@/hooks/portfolio/usePortfolioStatus";
import { useAuth } from "@/hooks/shared/useAuth";
import { AlertCircle, CheckCircle2, Clock, Edit, Eye, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function PortfolioOverview() {
    const { user } = useAuth();
    const { isLoading: isRandomPortfolioLoading, getRandomPortfolio } = useRandomPortfolio();

    // Use our new portfolio status hook
    const {
        portfolio,
        status,
        published,
        feedbackCount: portfolioFeedbackCount,
        canEdit,
        canPreview,
        isLoading: isStatusLoading,
        error: statusError,
        withdrawPortfolio,
        refetch
    } = usePortfolioStatus();

    // Separate feedback count for users without portfolio
    const [userFeedbackCount, setUserFeedbackCount] = useState(0);

    // Get user feedback count (independent of portfolio existence)
    useEffect(() => {
        async function fetchUserFeedbackCount() {
            if (!user) return;

            try {
                const response = await fetch('/api/user/feedback-count');
                const result = await response.json();

                if (response.ok) {
                    setUserFeedbackCount(result.count || 0);
                }
            } catch (error) {
                console.error('Error fetching user feedback count:', error);
            }
        }

        fetchUserFeedbackCount();
    }, [user]);

    // Use portfolio feedback count if available, otherwise user feedback count
    const feedbackCount = portfolioFeedbackCount || userFeedbackCount;

    // Calculate step status and progress
    const getStepStatus = (stepId: number) => {
        switch (stepId) {
            case 1: // Add Portfolio Details
                if (!portfolio) return 'pending';
                const hasImages = portfolio.images && portfolio.images.length > 0;
                const hasTitle = portfolio.title && portfolio.title.trim().length > 0;
                const hasWebsite = portfolio.website_url && portfolio.website_url.trim().length > 0;
                return (hasImages && hasTitle && hasWebsite) ? 'completed' : 'pending';

            case 2: // Give Feedback
                return feedbackCount >= 5 ? 'completed' : 'pending';

            case 3: // Submit Portfolio
                return (status === 'pending' || status === 'approved' || status === 'declined') ? 'completed' : 'pending';

            case 4: // Approval Status
                if (status === 'approved') return 'completed';
                if (status === 'declined') return 'declined';
                if (status === 'pending') return 'pending';
                return 'not_started';

            default:
                return 'pending';
        }
    };

    // Calculate Step 1 progress (0/3, 1/3, 2/3, 3/3)
    const getStep1Progress = () => {
        if (!portfolio) return { completed: 0, total: 3 };

        let completed = 0;
        if (portfolio.images && portfolio.images.length > 0) completed++;
        if (portfolio.title && portfolio.title.trim().length > 0) completed++;
        if (portfolio.website_url && portfolio.website_url.trim().length > 0) completed++;

        return { completed, total: 3 };
    };

    // Calculate Step 2 progress (feedback count)
    const getStep2Progress = () => {
        return { completed: Math.min(feedbackCount, 5), total: 5 };
    };

    // Get status badge for step 4
    const getStep4Badge = () => {
        switch (status) {
            case 'pending':
                return { text: 'Pending Review', variant: 'warning' as const, icon: Clock };
            case 'approved':
                if (published) {
                    return { text: 'Published', variant: 'success' as const, icon: CheckCircle2 };
                } else {
                    return { text: 'In Queue', variant: 'success' as const, icon: Clock };
                }
            case 'declined':
                return { text: 'Declined', variant: 'error' as const, icon: XCircle };
            default:
                return null;
        }
    };

    const step1Progress = getStep1Progress();
    const step2Progress = getStep2Progress();
    const step4Badge = getStep4Badge();

    const statusMessage = (() => {
        if (!portfolio) return 'Create your first portfolio to showcase your work.';
        switch (status) {
            case 'draft':
                return 'Continue editing your portfolio.';
            case 'pending':
                return 'Your portfolio is pending admin approval.';
            case 'approved':
                if (published) {
                    return 'Your portfolio has been approved and is now live!';
                } else {
                    return 'Your portfolio has been approved and is waiting to be published.';
                }
            case 'declined':
                return `Your portfolio was declined. Reason: ${portfolio.declined_reason || 'N/A'}`;
            default:
                return 'Loading portfolio status...';
        }
    })();

    // Get the primary action button for the blue container
    const getPrimaryAction = () => {
        const step1Status = getStepStatus(1);
        const step2Status = getStepStatus(2);
        const step3Status = getStepStatus(3);

        // If no portfolio exists yet, show "Get Started"
        if (!portfolio) {
            return (
                <Button asChild>
                    <Link href="/portfolio/upload#portfolio-actions">
                        Get Started
                    </Link>
                </Button>
            );
        }

        // If portfolio is pending and can be edited
        if (status === 'pending' && canEdit) {
            return (
                <Button
                    variant="secondary"
                    onClick={async () => {
                        try {
                            const result = await withdrawPortfolio();
                            if (result.success) {
                                refetch();
                            }
                        } catch (error) {
                            console.error('Failed to withdraw portfolio:', error);
                        }
                    }}
                >
                    <Edit size={16} className="mr-2" />
                    Edit Portfolio
                </Button>
            );
        }

        // If portfolio is published, show "See Portfolio" (link to live version)
        if (status === 'approved' && published && portfolio) {
            return (
                <Button asChild variant="secondary">
                    <Link href={`/portfolios/${portfolio.id}`}>
                        <Eye size={16} className="mr-2" />
                        See Portfolio
                    </Link>
                </Button>
            );
        }

        // If portfolio can be previewed (approved but not published, declined, pending)
        if (canPreview && (status === 'approved' || status === 'declined' || status === 'pending')) {
            return (
                <Button asChild variant="secondary">
                    <Link href="/portfolio/upload#portfolio-actions">
                        <Eye size={16} className="mr-2" />
                        Preview Portfolio
                    </Link>
                </Button>
            );
        }

        // If step 1 & 2 are complete and not yet submitted
        if (step1Status === 'completed' && step2Status === 'completed' && step3Status !== 'completed') {
            return (
                <Button asChild>
                    <Link href="/portfolio/upload#portfolio-actions">
                        Submit Portfolio
                    </Link>
                </Button>
            );
        }

        // If step 2 needs completion
        if (step1Status === 'completed' && step2Status !== 'completed') {
            return (
                <Button
                    variant="secondary"
                    onClick={getRandomPortfolio}
                    disabled={isRandomPortfolioLoading}
                >
                    {isRandomPortfolioLoading
                        ? 'Finding Portfolio...'
                        : `Give Feedback (${step2Progress.completed}/5)`
                    }
                </Button>
            );
        }

        // Default: Continue editing (step 1 incomplete or draft)
        return (
            <Button asChild>
                <Link href="/portfolio/upload#portfolio-actions">
                    {step1Progress.completed > 0 ? 'Continue Editing' : 'Get Started'}
                </Link>
            </Button>
        );
    };

    const steps = [
        {
            id: 1,
            title: 'Add Portfolio Details',
            description: 'Upload at least 1 image, add a title and website link to get started.',
            status: getStepStatus(1),
            progress: step1Progress
        },
        {
            id: 2,
            title: 'Give Feedback',
            description: 'Provide feedback on 5 other portfolios. This will only take a few minutes.',
            status: getStepStatus(2),
            progress: step2Progress
        },
        {
            id: 3,
            title: 'Submit Portfolio',
            description: 'Submit your portfolio once step 1 and 2 are completed.',
            status: getStepStatus(3),
            badge: getStepStatus(3) === 'completed' ? (
                <Badge variant="success" className="text-[10px] font-medium">
                    ✓ Submitted
                </Badge>
            ) : null
        },
        {
            id: 4,
            title: 'Approval Status',
            description: statusMessage || 'Wait for admin approval to make your portfolio publicly visible.',
            status: getStepStatus(4),
            badge: step4Badge ? (
                <Badge variant={step4Badge.variant} className="text-[10px] font-medium">
                    <step4Badge.icon size={12} className="mr-1" />
                    {step4Badge.text}
                </Badge>
            ) : null
        }
    ];

    const completedSteps = steps.filter(step => step.status === 'completed').length;
    const currentStep = Math.max(completedSteps, 1);

    if (!user) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Please log in to view your portfolio status.</p>
            </div>
        );
    }

    const isLoading = isStatusLoading;

    return (
        <div className="space-y-10">
            {/* Portfolio Overview Section */}
            <section aria-labelledby="overview-heading">
                <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                    <div>
                        <h2
                            id="overview-heading"
                            className="heading-section"
                        >
                            Upload Status
                        </h2>
                        <p className="text-small mt-2">
                            Follow the steps to upload your portfolio. This allows you to showcase your work publicly.
                        </p>
                    </div>
                    <div className="md:col-span-2 md:pl-16">
                        {/* Error State */}
                        {statusError && (
                            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 mb-6">
                                <div className="flex items-center">
                                    <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                                    <p className="text-red-800 dark:text-red-200">
                                        Error loading portfolio status: {statusError}
                                    </p>
                                </div>
                            </div>
                        )}

                        {isLoading ? (
                            <div className="animate-pulse space-y-6">
                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-24"></div>
                                {[1, 2, 3, 4].map((i) => (
                                    <div key={i} className="flex items-start space-x-4">
                                        <div className="w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                                        <div className="flex-1 space-y-2">
                                            <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {/* Step Progress */}
                                <div className="flex items-center justify-end space-x-4">
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        Step {currentStep}/4
                                    </span>
                                    <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${(completedSteps / 4) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Portfolio Status Summary */}
                                <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-medium text-blue-900 dark:text-blue-100">
                                                {portfolio ? `Portfolio: ${portfolio.title || 'Untitled'}` : 'Ready to get started?'}
                                            </h3>
                                            <p className="text-blue-700 dark:text-blue-300 text-sm mt-1">
                                                {statusMessage || 'Create your first portfolio to showcase your work.'}
                                            </p>
                                        </div>
                                        <div className="ml-4 flex-shrink-0">
                                            {getPrimaryAction()}
                                        </div>
                                    </div>
                                </div>

                                {/* Steps List */}
                                <ul role="list" className="space-y-4">
                                    {steps.map((step) => (
                                        <li
                                            key={step.id}
                                            className="relative rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50 p-4"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div className="flex items-start space-x-3">
                                                    {step.status === 'completed' ? (
                                                        <CheckCircle2
                                                            className="size-6 shrink-0 text-blue-600 dark:text-blue-400"
                                                            aria-hidden={true}
                                                        />
                                                    ) : step.status === 'declined' ? (
                                                        <XCircle
                                                            className="size-6 shrink-0 text-red-600 dark:text-red-400"
                                                            aria-hidden={true}
                                                        />
                                                    ) : step.status === 'pending' && step.id === 4 ? (
                                                        <Clock
                                                            className="size-6 shrink-0 text-yellow-600 dark:text-yellow-400"
                                                            aria-hidden={true}
                                                        />
                                                    ) : (
                                                        <span
                                                            className="flex size-6 items-center justify-center font-medium text-gray-600 dark:text-gray-400"
                                                            aria-hidden={true}
                                                        >
                                                            {step.id}.
                                                        </span>
                                                    )}
                                                    <div className="flex-1">
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="font-medium text-gray-900 dark:text-gray-100">
                                                                {step.title}
                                                            </h3>
                                                            {step.badge}
                                                        </div>
                                                        <p className="mt-1 text-sm leading-6 text-gray-600 dark:text-gray-400">
                                                            {step.description}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Progress indicators top right */}
                                                {step.progress && (
                                                    <div className="flex items-center space-x-2">
                                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                                            {step.progress.completed}/{step.progress.total}
                                                        </span>
                                                        <div className="flex space-x-1">
                                                            {Array.from({ length: step.progress.total }, (_, i) => (
                                                                <div
                                                                    key={i}
                                                                    className={`w-1 h-4 rounded-full ${i < step.progress.completed
                                                                        ? 'bg-green-600'
                                                                        : 'bg-gray-300 dark:bg-gray-600'
                                                                        }`}
                                                                />
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>

                                {/* Need Help Section */}
                                <div className="rounded-lg bg-gray-50 dark:bg-gray-900/50 p-5">
                                    <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                        Need help?
                                    </h4>
                                    <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                                        Something not working? Contact our support team at{' '}
                                        <a
                                            href="mailto:support@vibefolio.com"
                                            className="font-medium text-blue-600 dark:text-blue-400"
                                        >
                                            support@vibefolio.com
                                        </a>
                                        .
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    );
}
