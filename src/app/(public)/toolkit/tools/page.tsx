"use client";

import { SectionLayout } from "@/components/layouts/SectionLayout";
import { Divider } from "@/components/ui/Divider";
import { createClient } from "@/lib/supabase/client";
import { ToolkitCategory, ToolkitWithCategory } from "@/types";
import { ExternalLink } from "lucide-react";
import React, { useEffect, useState } from "react";

export default function ToolsPage() {
    const [tools, setTools] = useState<ToolkitWithCategory[]>([]);
    const [categories, setCategories] = useState<ToolkitCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [loading, setLoading] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch categories
            const { data: categoriesData, error: categoriesError } = await supabase
                .from("toolkit_category")
                .select("*")
                .order("order_index", { ascending: true });

            if (categoriesError) throw categoriesError;

            // Fetch tools with category relation (only active tools)
            const { data: toolsData, error: toolsError } = await supabase
                .from("toolkit")
                .select(`
                    *,
                    category:toolkit_category(*)
                `)
                .eq("is_active", true)
                .order("order_index", { ascending: true });

            if (toolsError) throw toolsError;

            // Filter categories that have at least one active tool
            const toolsByCategoryId = new Map<string, number>();
            (toolsData as ToolkitWithCategory[]).forEach((tool) => {
                const count = toolsByCategoryId.get(tool.category_id) || 0;
                toolsByCategoryId.set(tool.category_id, count + 1);
            });

            const categoriesWithTools = (categoriesData || []).filter((cat: ToolkitCategory) =>
                toolsByCategoryId.has(cat.id)
            );

            setCategories(categoriesWithTools);
            setTools(toolsData as ToolkitWithCategory[] || []);
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Filter tools by selected category
    const filteredTools = selectedCategory === "all"
        ? tools
        : tools.filter((tool) => tool.category_id === selectedCategory);

    // Group tools by category for display
    const toolsByCategory = filteredTools.reduce((acc, tool) => {
        const categoryId = tool.category_id;
        if (!acc[categoryId]) {
            acc[categoryId] = [];
        }
        acc[categoryId].push(tool);
        return acc;
    }, {} as Record<string, ToolkitWithCategory[]>);

    if (loading) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">Loading tools...</p>
            </div>
        );
    }

    if (categories.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-600 dark:text-gray-400">No tools available yet.</p>
            </div>
        );
    }

    return (
        <SectionLayout
            title="Tools"
            subtitle="Curated tools and resources to help you build stunning portfolios that get noticed"
            tabs={[
                { id: "all", label: "All Categories" },
                ...categories.map((cat) => ({ id: cat.id, label: cat.name })),
            ]}
            activeTab={selectedCategory}
            onTabChange={setSelectedCategory}
            layoutId="toolkit-category-tabs"
        >
            {/* Tools Grid - 3 Columns Layout (like upload sections) */}
            {selectedCategory !== "all" ? (
                // Single category view
                <>
                    <Divider />
                    <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3 pb-16">
                    {/* Left: Category Info (1 column) */}
                    <div>
                        {categories
                            .filter((cat) => cat.id === selectedCategory)
                            .map((category) => (
                                <div key={category.id}>
                                    <h2 className="heading-section">
                                        {category.name}
                                    </h2>
                                    {category.description && (
                                        <p className="text-small mt-2">
                                            {category.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                    </div>

                    {/* Right: Tool Cards (2 columns, 2 cards per row) */}
                    <div className="md:col-span-2 md:pl-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredTools.map((tool) => (
                                <ToolCard key={tool.id} tool={tool} />
                            ))}
                        </div>
                    </div>
                </div>
                    {filteredTools.length === 0 && (
                        <div className="text-center py-20">
                            <p className="text-gray-600 dark:text-gray-400">
                                No tools found in this category.
                            </p>
                        </div>
                    )}
                </>
            ) : (
                // All categories view
                <div>
                    {categories.map((category) => {
                        const categoryTools = toolsByCategory[category.id] || [];
                        if (categoryTools.length === 0) return null;

                        return (
                            <React.Fragment key={category.id}>
                                <Divider />
                                <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3 pb-16">
                                    {/* Left: Category Info (1 column) */}
                                    <div>
                                        <h2 className="heading-section">
                                            {category.name}
                                        </h2>
                                        {category.description && (
                                            <p className="text-small mt-2">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Right: Tool Cards (2 columns, 2 cards per row) */}
                                    <div className="md:col-span-2 md:pl-16">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {categoryTools.map((tool) => (
                                                <ToolCard key={tool.id} tool={tool} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })}
                </div>
            )}
        </SectionLayout>
    );
}

// Tool Card Component
function ToolCard({ tool }: { tool: ToolkitWithCategory }) {
    return (
        <a
            href={tool.affiliate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-6 border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:scale-[1.02] transition-all group relative"
        >
            {/* External Link Icon - Top Right */}
            <div className="absolute top-6 right-6">
                <ExternalLink className="w-3.5 h-3.5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
            </div>

            <div className="flex flex-col h-full">
                {/* Icon */}
                {tool.icon_url && (
                    <div className="mb-4">
                        <img
                            src={tool.icon_url}
                            alt={tool.name}
                            className="w-8 h-8 object-contain"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 pr-6">
                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-50 mb-1">
                        {tool.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">
                        {tool.description}
                    </p>
                </div>
            </div>
        </a>
    );
}

