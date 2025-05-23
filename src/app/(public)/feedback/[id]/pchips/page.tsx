import FeedbackChips from "@/components/feedback/FeedbackChips";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function PositiveFeedbackChipsPage({ params }: PageProps) {
    const supabase = createServerComponentClient({ cookies });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    const { data: portfolio } = await supabase
        .from("portfolios")
        .select("id")
        .eq("id", params.id)
        .single();

    if (!portfolio) {
        redirect('/');
    }

    return (
        <div className="flex h-screen flex-col items-center justify-center bg-white dark:bg-[#090E1A]">
            <div className="w-full max-w-2xl p-6">
                <h1 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
                    What do you like about this portfolio?
                </h1>
                <FeedbackChips portfolioId={portfolio.id} />
            </div>
        </div>
    );
} 