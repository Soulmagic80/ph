"use client";

import { createClient } from "@/lib/supabase/client";
import { Toolkit, ToolkitCategory, ToolkitWithCategory } from "@/types";
import { Button, Switch, TextInput, Textarea } from "@tremor/react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminToolkitPage() {
    const [tools, setTools] = useState<ToolkitWithCategory[]>([]);
    const [categories, setCategories] = useState<ToolkitCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [showToolModal, setShowToolModal] = useState(false);
    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [editingTool, setEditingTool] = useState<Toolkit | null>(null);
    const [editingCategory, setEditingCategory] = useState<ToolkitCategory | null>(null);

    // Tool form state
    const [toolForm, setToolForm] = useState({
        name: "",
        description: "",
        category_id: "",
        affiliate_link: "",
        order_index: 0,
        is_active: true,
        icon_file: null as File | null,
    });

    // Category form state
    const [categoryForm, setCategoryForm] = useState({
        name: "",
        slug: "",
        description: "",
        order_index: 0,
    });

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
            setCategories(categoriesData || []);

            // Fetch tools with category relation
            const { data: toolsData, error: toolsError } = await supabase
                .from("toolkit")
                .select(`
          *,
          category:toolkit_category(*)
        `)
                .order("order_index", { ascending: true });

            if (toolsError) throw toolsError;
            setTools(toolsData as ToolkitWithCategory[] || []);
        } catch (error) {
            console.error("Error fetching data:", error);
            toast.error("Failed to load toolkit data");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteTool = async (id: string) => {
        if (!confirm("Are you sure you want to delete this tool?")) return;

        try {
            const { error } = await supabase.from("toolkit").delete().eq("id", id);
            if (error) throw error;

            toast.success("Tool deleted successfully");
            fetchData();
        } catch (error) {
            console.error("Error deleting tool:", error);
            toast.error("Failed to delete tool");
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Are you sure you want to delete this category? All tools in this category will also be deleted.")) return;

        try {
            const { error } = await supabase.from("toolkit_category").delete().eq("id", id);
            if (error) throw error;

            toast.success("Category deleted successfully");
            fetchData();
        } catch (error) {
            console.error("Error deleting category:", error);
            toast.error("Failed to delete category");
        }
    };

    // Tool Modal Handlers
    const openToolModal = (tool?: Toolkit) => {
        if (tool) {
            setEditingTool(tool);
            setToolForm({
                name: tool.name,
                description: tool.description,
                category_id: tool.category_id,
                affiliate_link: tool.affiliate_link,
                order_index: tool.order_index,
                is_active: tool.is_active,
                icon_file: null,
            });
        } else {
            setEditingTool(null);
            setToolForm({
                name: "",
                description: "",
                category_id: categories[0]?.id || "",
                affiliate_link: "",
                order_index: tools.length,
                is_active: true,
                icon_file: null,
            });
        }
        setShowToolModal(true);
    };

    const closeToolModal = () => {
        setShowToolModal(false);
        setEditingTool(null);
        setToolForm({
            name: "",
            description: "",
            category_id: "",
            affiliate_link: "",
            order_index: 0,
            is_active: true,
            icon_file: null,
        });
    };

    const handleToolSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            let iconUrl = editingTool?.icon_url || null;

            // Upload icon if a new file was selected
            if (toolForm.icon_file) {
                const fileExt = toolForm.icon_file.name.split('.').pop();
                const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
                const filePath = `${fileName}`;

                const { error: uploadError } = await supabase.storage
                    .from('toolkit-icons')
                    .upload(filePath, toolForm.icon_file);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from('toolkit-icons')
                    .getPublicUrl(filePath);

                iconUrl = publicUrl;
            }

            const toolData = {
                name: toolForm.name,
                description: toolForm.description,
                category_id: toolForm.category_id,
                affiliate_link: toolForm.affiliate_link,
                order_index: toolForm.order_index,
                is_active: toolForm.is_active,
                icon_url: iconUrl,
            };

            if (editingTool) {
                // Update existing tool
                const { error } = await supabase
                    .from("toolkit")
                    .update(toolData)
                    .eq("id", editingTool.id);

                if (error) throw error;
                toast.success("Tool updated successfully");
            } else {
                // Create new tool
                const { error } = await supabase
                    .from("toolkit")
                    .insert(toolData);

                if (error) throw error;
                toast.success("Tool created successfully");
            }

            closeToolModal();
            fetchData();
        } catch (error) {
            console.error("Error saving tool:", error);
            toast.error("Failed to save tool");
        }
    };

    // Category Modal Handlers
    const openCategoryModal = (category?: ToolkitCategory) => {
        if (category) {
            setEditingCategory(category);
            setCategoryForm({
                name: category.name,
                slug: category.slug,
                description: category.description || "",
                order_index: category.order_index,
            });
        } else {
            setEditingCategory(null);
            setCategoryForm({
                name: "",
                slug: "",
                description: "",
                order_index: categories.length,
            });
        }
        setShowCategoryModal(true);
    };

    const closeCategoryModal = () => {
        setShowCategoryModal(false);
        setEditingCategory(null);
        setCategoryForm({
            name: "",
            slug: "",
            description: "",
            order_index: 0,
        });
    };

    const handleCategorySubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const categoryData = {
                name: categoryForm.name,
                slug: categoryForm.slug || categoryForm.name.toLowerCase().replace(/\s+/g, '-'),
                description: categoryForm.description,
                order_index: categoryForm.order_index,
            };

            if (editingCategory) {
                // Update existing category
                const { error } = await supabase
                    .from("toolkit_category")
                    .update(categoryData)
                    .eq("id", editingCategory.id);

                if (error) throw error;
                toast.success("Category updated successfully");
            } else {
                // Create new category
                const { error } = await supabase
                    .from("toolkit_category")
                    .insert(categoryData);

                if (error) throw error;
                toast.success("Category created successfully");
            }

            closeCategoryModal();
            fetchData();
        } catch (error) {
            console.error("Error saving category:", error);
            toast.error("Failed to save category");
        }
    };

    if (loading) {
        return <div className="p-8">Loading...</div>;
    }

    return (
        <div className="space-y-12">
            {/* Categories Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: Title & Description */}
                <div className="lg:col-span-1">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                        Categories
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Organize tools into categories for better navigation
                    </p>
                </div>

                {/* Right: Content */}
                <div className="lg:col-span-2">
                    <div className="flex justify-end mb-4">
                        <Button
                            onClick={() => openCategoryModal()}
                            icon={Plus}
                            variant="primary"
                        >
                            Add Category
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {categories.map((category) => (
                            <div
                                key={category.id}
                                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-gray-50">
                                            {category.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            {category.description || "No description"}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                            Order: {category.order_index}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="xs"
                                            variant="light"
                                            icon={Pencil}
                                            onClick={() => openCategoryModal(category)}
                                        />
                                        <Button
                                            size="xs"
                                            variant="light"
                                            icon={Trash2}
                                            color="red"
                                            onClick={() => handleDeleteCategory(category.id)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {categories.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            No categories yet. Add your first category!
                        </div>
                    )}
                </div>
            </div>

            {/* Tools Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left: Title & Description */}
                <div className="lg:col-span-1">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
                        Tools
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Manage design tools with affiliate links
                    </p>
                </div>

                {/* Right: Content */}
                <div className="lg:col-span-2">
                    <div className="flex justify-end mb-4">
                        <Button
                            onClick={() => openToolModal()}
                            icon={Plus}
                            variant="primary"
                            disabled={categories.length === 0}
                        >
                            Add Tool
                        </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {tools.map((tool) => (
                            <div
                                key={tool.id}
                                className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                            >
                                <div className="flex items-start gap-4">
                                    {tool.icon_url && (
                                        <img
                                            src={tool.icon_url}
                                            alt={tool.name}
                                            className="w-12 h-12 object-contain rounded"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-gray-900 dark:text-gray-50 truncate">
                                            {tool.name}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                                            {tool.description}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                                            Category: {tool.category.name}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-500">
                                            Order: {tool.order_index} • {tool.is_active ? "Active" : "Inactive"}
                                        </p>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button
                                            size="xs"
                                            variant="light"
                                            icon={Pencil}
                                            onClick={() => openToolModal(tool)}
                                        />
                                        <Button
                                            size="xs"
                                            variant="light"
                                            icon={Trash2}
                                            color="red"
                                            onClick={() => handleDeleteTool(tool.id)}
                                        />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {tools.length === 0 && (
                        <div className="text-center py-12 text-gray-500">
                            {categories.length === 0
                                ? "Please add a category first"
                                : "No tools yet. Add your first tool!"}
                        </div>
                    )}
                </div>
            </div>

            {/* Tool Modal */}
            {showToolModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                                    {editingTool ? "Edit Tool" : "Add Tool"}
                                </h3>
                                <button
                                    onClick={closeToolModal}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleToolSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Tool Name *
                                    </label>
                                    <TextInput
                                        value={toolForm.name}
                                        onChange={(e) => setToolForm({ ...toolForm, name: e.target.value })}
                                        placeholder="e.g. Figma"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Description *
                                    </label>
                                    <Textarea
                                        value={toolForm.description}
                                        onChange={(e) => setToolForm({ ...toolForm, description: e.target.value })}
                                        placeholder="Brief description of the tool"
                                        rows={3}
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Category *
                                    </label>
                                    <select
                                        value={toolForm.category_id}
                                        onChange={(e) => setToolForm({ ...toolForm, category_id: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50"
                                        required
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Affiliate Link *
                                    </label>
                                    <TextInput
                                        value={toolForm.affiliate_link}
                                        onChange={(e) => setToolForm({ ...toolForm, affiliate_link: e.target.value })}
                                        placeholder="https://example.com?ref=..."
                                        type="url"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Icon
                                    </label>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setToolForm({ ...toolForm, icon_file: e.target.files?.[0] || null })}
                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                    {editingTool?.icon_url && !toolForm.icon_file && (
                                        <p className="text-xs text-gray-500 mt-1">
                                            Current icon will be kept if no new file is selected
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Order Index
                                        </label>
                                        <TextInput
                                            type="number"
                                            value={toolForm.order_index.toString()}
                                            onChange={(e) => setToolForm({ ...toolForm, order_index: parseInt(e.target.value) || 0 })}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                            Active
                                        </label>
                                        <div className="mt-2">
                                            <Switch
                                                checked={toolForm.is_active}
                                                onChange={(checked) => setToolForm({ ...toolForm, is_active: checked })}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="secondary" onClick={closeToolModal} type="button">
                                        Cancel
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        {editingTool ? "Update Tool" : "Create Tool"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Category Modal */}
            {showCategoryModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-900 rounded-lg max-w-md w-full">
                        <div className="p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                                    {editingCategory ? "Edit Category" : "Add Category"}
                                </h3>
                                <button
                                    onClick={closeCategoryModal}
                                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <form onSubmit={handleCategorySubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Category Name *
                                    </label>
                                    <TextInput
                                        value={categoryForm.name}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                                        placeholder="e.g. Color Tools"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Slug (optional)
                                    </label>
                                    <TextInput
                                        value={categoryForm.slug}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                                        placeholder="Auto-generated from name if empty"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Description
                                    </label>
                                    <Textarea
                                        value={categoryForm.description}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                                        placeholder="Brief description of this category"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Order Index
                                    </label>
                                    <TextInput
                                        type="number"
                                        value={categoryForm.order_index.toString()}
                                        onChange={(e) => setCategoryForm({ ...categoryForm, order_index: parseInt(e.target.value) || 0 })}
                                    />
                                </div>

                                <div className="flex justify-end gap-2 pt-4">
                                    <Button variant="secondary" onClick={closeCategoryModal} type="button">
                                        Cancel
                                    </Button>
                                    <Button variant="primary" type="submit">
                                        {editingCategory ? "Update Category" : "Create Category"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
