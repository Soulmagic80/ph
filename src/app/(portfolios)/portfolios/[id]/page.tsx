import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { notFound } from "next/navigation";

interface PortfolioPageProps {
    params: {
        id: string;
    };
}

export default async function PortfolioPage({ params }: PortfolioPageProps) {
    if (!params.id) {
        notFound();
    }

    // Portfolio-Daten aus der Datenbank laden
    const { data: portfolio, error } = await supabase
        .from("portfolios")
        .select("*")
        .eq("id", params.id)
        .single();

    if (error || !portfolio) {
        notFound();
    }

    // Bild-URL aus Storage oder Fallback
    const imageSrc = portfolio.image
        ? `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/portfolio-images/${portfolio.image}`
        : portfolio.image_url || null;

    return (
        <main className="w-full mx-auto bg-white dark:bg-gray-925">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            {portfolio.title}
                        </h1>
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                            Portfolio von {portfolio.user_name || "Anonym"}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                        {imageSrc && (
                            <div className="w-full aspect-video relative">
                                <Image
                                    src={imageSrc}
                                    alt={portfolio.title}
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        )}

                        <div className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                        Beschreibung
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-300">
                                        {portfolio.description || "Keine Beschreibung verfügbar"}
                                    </p>
                                </div>

                                {portfolio.tags && portfolio.tags.length > 0 && (
                                    <div>
                                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                            Technologien
                                        </h2>
                                        <div className="flex flex-wrap gap-2">
                                            {portfolio.tags.map((tag: string, index: number) => (
                                                <span
                                                    key={index}
                                                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm text-gray-700 dark:text-gray-300"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                <div className="flex items-center gap-4">
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 dark:text-gray-400">Upvotes:</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            {portfolio.upvotes}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-gray-500 dark:text-gray-400">Rang:</span>
                                        <span className="font-semibold text-gray-900 dark:text-white">
                                            #{portfolio.rank_all_time || "?"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
} 