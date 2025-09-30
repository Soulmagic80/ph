'use client'

import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Plus, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface Tool {
    id: string
    name: string
    category: string
}

interface ToolsSelectorProps {
    selectedTools: Tool[]
    availableTools: Tool[]
    onToolsChange: (tools: Tool[]) => void
    isLoading?: boolean
    maxTools?: number
    _isReadOnly?: boolean
}

export default function ToolsSelector({
    selectedTools,
    availableTools,
    onToolsChange,
    isLoading = false,
    maxTools = 5
}: ToolsSelectorProps) {
    const [isAdding, setIsAdding] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState<Tool[]>([])
    const [isSearching, setIsSearching] = useState(false)
    const [showResults, setShowResults] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)

    // Close results when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setShowResults(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const performSearch = useCallback((query: string) => {
        setIsSearching(true)

        // Filter tools based on search query
        const filtered = availableTools.filter(tool =>
            !selectedTools.find(t => t.id === tool.id) && // Not already selected
            (tool.name.toLowerCase().includes(query.toLowerCase()) ||
                tool.category.toLowerCase().includes(query.toLowerCase()))
        )

        // Sort by relevance (exact matches first, then partial matches)
        const sorted = filtered.sort((a, b) => {
            const aExact = a.name.toLowerCase() === query.toLowerCase()
            const bExact = b.name.toLowerCase() === query.toLowerCase()

            if (aExact && !bExact) return -1
            if (!aExact && bExact) return 1

            return a.name.localeCompare(b.name)
        })

        setSearchResults(sorted.slice(0, 10)) // Limit to 10 results
        setShowResults(true)
        setIsSearching(false)
    }, [availableTools, selectedTools])

    // Debounced search
    useEffect(() => {
        const timer = setTimeout(() => {
            if (searchQuery.length >= 2) {
                performSearch(searchQuery)
            } else {
                setSearchResults([])
                setShowResults(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [searchQuery, performSearch])

    const handleAddTool = (tool: Tool) => {
        if (!selectedTools.find(t => t.id === tool.id) && selectedTools.length < maxTools) {
            onToolsChange([...selectedTools, tool])
        }
        setSearchQuery('')
        setShowResults(false)
        setIsAdding(false)
    }

    const handleRemoveTool = (toolId: string) => {
        onToolsChange(selectedTools.filter(t => t.id !== toolId))
    }

    const handleSearchFocus = () => {
        if (searchQuery.length >= 2) {
            setShowResults(true)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            setShowResults(false)
            setIsAdding(false)
            setSearchQuery('')
            inputRef.current?.blur()
        }
    }

    // Group tools by category for better display
    const groupedResults = searchResults.reduce((acc, tool) => {
        if (!acc[tool.category]) {
            acc[tool.category] = []
        }
        acc[tool.category].push(tool)
        return acc
    }, {} as Record<string, Tool[]>)

    const canAddMore = selectedTools.length < maxTools

    if (isLoading) {
        return (
            <div className="border border-gray-300 dark:border-gray-700 rounded-md p-4">
                <div className="animate-pulse space-y-3">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {/* Selected Tools */}
            {selectedTools.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {selectedTools.map((tool) => (
                        <Badge
                            key={tool.id}
                            variant="default"
                            className="flex items-center gap-1 px-2 py-1 text-sm"
                        >
                            {tool.name}
                            <button
                                onClick={() => handleRemoveTool(tool.id)}
                                className="ml-1 hover:bg-blue-200 dark:hover:bg-blue-800 rounded-full p-0.5 transition-colors"
                                type="button"
                                aria-label={`Remove ${tool.name} tool`}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </Badge>
                    ))}
                </div>
            )}

            {/* Tool count indicator */}
            <div className="text-xs text-gray-500">
                {selectedTools.length}/{maxTools} tools selected
                {!canAddMore && " (maximum reached)"}
            </div>

            {/* Add Tool Button or Search */}
            {!isAdding ? (
                <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setIsAdding(true)}
                    className="mt-2"
                    disabled={!canAddMore}
                >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Tool
                </Button>
            ) : (

                <div className="space-y-2">
                    {/* Search Input */}
                    <div className="space-y-2" ref={searchRef}>
                        <div className="relative">
                            <Input
                                ref={inputRef}
                                type="text"
                                placeholder="Search for tools (e.g., 'React', 'Figma', 'Node.js')..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onFocus={handleSearchFocus}
                                onKeyDown={handleKeyDown}
                                autoFocus
                                className="mt-2"
                            />
                            {isSearching && (
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                </div>
                            )}
                        </div>

                        {/* Search Results Dropdown */}
                        {showResults && Object.keys(groupedResults).length > 0 && (
                            <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto transition-all duration-200 ease-out">
                                {Object.entries(groupedResults).map(([category, tools]) => (
                                    <div key={category}>
                                        <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700 text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wide">
                                            {category}
                                        </div>
                                        {tools.map((tool) => (
                                            <button
                                                key={tool.id}
                                                onClick={() => handleAddTool(tool)}
                                                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                                type="button"
                                                disabled={!canAddMore}
                                            >
                                                <div className="font-medium text-gray-900 dark:text-gray-100">
                                                    {tool.name}
                                                </div>
                                                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                                    {tool.category}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* No Results */}
                        {showResults && searchQuery.length >= 2 && Object.keys(groupedResults).length === 0 && !isSearching && (
                            <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg transition-all duration-200 ease-out">
                                <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                    No tools found for &quot;{searchQuery}&quot;
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                            Type to search • Click to add • Escape to cancel
                        </div>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => {
                                    setIsAdding(false);
                                    setSearchQuery('');
                                    setShowResults(false);
                                }}
                                className="border-gray-300 dark:border-gray-700"
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}






