"use client";

import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";

interface AdminActionsProps {
    portfolioId: string;
    isProcessing: boolean;
    onProcessingChange: (id: string | null) => void;
    onPortfolioUpdate: () => void;
}

export default function AdminActions({
    portfolioId,
    isProcessing,
    onProcessingChange,
    onPortfolioUpdate
}: AdminActionsProps) {

    const handleApprove = async () => {
        onProcessingChange(portfolioId);
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('portfolios')
                .update({
                    status: 'approved',
                    approved: true,
                    published: false  // Will be published via CronJob tab
                })
                .eq('id', portfolioId);

            if (error) {
                console.error('Error approving portfolio:', error);
                toast.error('Failed to approve portfolio');
                return;
            }

            toast.success('Portfolio approved successfully');
            onPortfolioUpdate();
        } catch (error) {
            console.error('Error approving portfolio:', error);
            toast.error('Failed to approve portfolio');
        } finally {
            onProcessingChange(null);
        }
    };

    const handleDecline = async () => {
        onProcessingChange(portfolioId);
        try {
            const supabase = createClient();
            const { error } = await supabase
                .from('portfolios')
                .update({
                    status: 'declined',
                    approved: false,
                    published: false
                })
                .eq('id', portfolioId);

            if (error) {
                console.error('Error declining portfolio:', error);
                toast.error('Failed to decline portfolio');
                return;
            }

            toast.success('Portfolio declined');
            onPortfolioUpdate();
        } catch (error) {
            console.error('Error declining portfolio:', error);
            toast.error('Failed to decline portfolio');
        } finally {
            onProcessingChange(null);
        }
    };

    return (
        <div className="flex gap-2">
            <Button
                onClick={handleApprove}
                disabled={isProcessing}
                variant="primary"
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white"
            >
                <CheckCircle size={16} />
                {isProcessing ? 'Processing...' : 'Approve'}
            </Button>
            <Button
                onClick={handleDecline}
                disabled={isProcessing}
                variant="destructive"
                className="flex items-center gap-2"
            >
                <XCircle size={16} />
                {isProcessing ? 'Processing...' : 'Decline'}
            </Button>
        </div>
    );
}
