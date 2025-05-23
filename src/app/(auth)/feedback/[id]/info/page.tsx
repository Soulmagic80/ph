import { Button } from "@/components/ui/Button";
import { FeedbackProvider } from "@/context/FeedbackContext";
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface PageProps {
    params: {
        id: string;
    };
}

export default async function FeedbackInfoPage({ params }: PageProps) {
    const cookieStore = cookies()
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    const { data: { session } } = await supabase.auth.getSession();

    if (!session) {
        redirect('/login');
    }

    return (
        <FeedbackProvider>
            <div className="flex h-screen flex-col items-center justify-center bg-white dark:bg-[#090E1A]">
                <div className="w-full max-w-2xl p-6">
                    <h1 className="mb-8 text-center text-2xl font-bold text-gray-900 dark:text-white">
                        Help improve this portfolio
                    </h1>
                    <p className="mb-8 text-center text-gray-600 dark:text-gray-400">
                        Your feedback helps designers improve their work. Share what you like and what could be better.
                    </p>
                    <div className="flex justify-center">
                        <Button asChild>
                            <a href={`/feedback/${params.id}/pchips`}>
                                Start Feedback
                            </a>
                        </Button>
                    </div>
                </div>
            </div>
        </FeedbackProvider>
    );
} 