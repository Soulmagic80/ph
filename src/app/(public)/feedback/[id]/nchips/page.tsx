import NegativeFeedbackChips from "@/components/feedback/NegativeFeedbackChips";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";

interface PageProps {
    params: {
        slug: string;
    };
}

export default async function NegativeFeedbackChipsPage({ params }: PageProps) {
    const supabase = createServerComponentClient({ cookies });
    const { data: portfolio } = await supabase
        .from("portfolios")
        .select("id")
        .eq("slug", params.slug)
        .single();

    if (!portfolio) {
        notFound();
    }

    return <NegativeFeedbackChips portfolioId={portfolio.id} />;
} 