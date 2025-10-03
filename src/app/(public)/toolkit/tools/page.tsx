"use client";

import { ButtonTabs } from "@/components/ui/ButtonTabs";
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
        <div>
            {/* Header with Title and Subtitle - Full Width */}
            <div className="mb-10">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                    Tools
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    Curated tools and resources to help you build stunning portfolios that get noticed
                </p>
            </div>

            {/* Category Filter Tabs - Full Width */}
            <div className="mb-6 space-y-4">
                <ButtonTabs
                    tabs={[
                        { id: "all", label: "All Categories" },
                        ...categories.map((cat) => ({ id: cat.id, label: cat.name })),
                    ]}
                    activeTab={selectedCategory}
                    onTabChange={setSelectedCategory}
                    layoutId="toolkit-category-tabs"
                />
                <div className="border-t border-gray-200 dark:border-gray-800" />
            </div>

            {/* Tools Grid - 3 Columns Layout (like upload sections) */}
            {selectedCategory !== "all" ? (
                // Single category view
                <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3 pb-10">
                    {/* Left: Category Info (1 column) */}
                    <div>
                        {categories
                            .filter((cat) => cat.id === selectedCategory)
                            .map((category) => (
                                <div key={category.id}>
                                    <h2 className="font-semibold text-gray-900 dark:text-gray-50">
                                        {category.name}
                                    </h2>
                                    {category.description && (
                                        <p className="mt-2 text-sm leading-6 text-gray-500">
                                            {category.description}
                                        </p>
                                    )}
                                </div>
                            ))}
                    </div>

                    {/* Right: Tool Cards (2 columns, 3 cards per row) */}
                    <div className="md:col-span-2 md:pl-16">
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                            {filteredTools.map((tool) => (
                                <ToolCard key={tool.id} tool={tool} />
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                // All categories view
                <div>
                    {categories.map((category, index) => {
                        const categoryTools = toolsByCategory[category.id] || [];
                        if (categoryTools.length === 0) return null;

                        return (
                            <React.Fragment key={category.id}>
                                <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3 pb-10">
                                    {/* Left: Category Info (1 column) */}
                                    <div>
                                        <h2 className="font-semibold text-gray-900 dark:text-gray-50">
                                            {category.name}
                                        </h2>
                                        {category.description && (
                                            <p className="mt-2 text-sm leading-6 text-gray-500">
                                                {category.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Right: Tool Cards (2 columns, 3 cards per row) */}
                                    <div className="md:col-span-2 md:pl-16">
                                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                                            {categoryTools.map((tool) => (
                                                <ToolCard key={tool.id} tool={tool} />
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Divider between categories (except after last one) */}
                                {index < categories.filter(cat => (toolsByCategory[cat.id] || []).length > 0).length - 1 && (
                                    <Divider />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            )}

            {filteredTools.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-gray-600 dark:text-gray-400">
                        No tools found in this category.
                    </p>
                </div>
            )}
        </div>
    );
}

// Tool Card Component
function ToolCard({ tool }: { tool: ToolkitWithCategory }) {
    return (
        <a
            href={tool.affiliate_link}
            target="_blank"
            rel="noopener noreferrer"
            className="block p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:border-gray-300 dark:hover:border-gray-600 transition-colors group"
        >
            <div className="flex flex-col h-full">
                {/* Icon */}
                {tool.icon_url && (
                    <div className="mb-3">
                        <img
                            src={tool.icon_url}
                            alt={tool.name}
                            className="w-12 h-12 object-contain"
                        />
                    </div>
                )}

                {/* Content */}
                <div className="flex-1 mb-3">
                    <h3 className="font-semibold text-gray-900 dark:text-gray-50 mb-1">
                        {tool.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {tool.description}
                    </p>
                </div>

                {/* External Link Icon - Bottom Right */}
                <div className="flex justify-end">
                    <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
                </div>
            </div>
        </a>
    );
}

