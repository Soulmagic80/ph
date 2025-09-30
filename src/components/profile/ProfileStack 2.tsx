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

interface ProfileStackProps {
    selectedTools: Tool[]
    availableTools: Tool[]
    onToolsChange: (tools: Tool[]) => void
}

export default function ProfileStack({
    selectedTools,
    availableTools,
    onToolsChange
}: ProfileStackProps) {
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
        if (!selectedTools.find(t => t.id === tool.id)) {
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
            setIsAdding(false)
            setSearchQuery('')
            setShowResults(false)
        }
    }

    return (
        <section aria-labelledby="profile-stack-heading">
            <div className="grid grid-cols-1 gap-x-14 gap-y-8 md:grid-cols-3">
                <div>
                    <h2
                        id="profile-stack-heading"
                        className="scroll-mt-10 font-semibold text-gray-900 dark:text-gray-50"
                    >
                        Tech Stack
                    </h2>
                    <p className="mt-2 text-sm leading-6 text-gray-500">
                        Select the tools and technologies you work with.
                    </p>
                </div>
                <div className="md:col-span-2 md:pl-24">
                    <div className="space-y-6">
                        {/* Selected Tools - shown above button when tools exist */}
                        {selectedTools.length > 0 && (
                            <div className="space-y-4">
                                <div className="flex flex-wrap gap-2">
                                    {selectedTools.map((tool) => (
                                        <Badge
                                            key={tool.id}
                                            variant="default"
                                            className="flex items-center gap-1 px-2 py-1 text-sm bg-green-50 text-green-900 ring-1 ring-inset ring-green-600/30 dark:bg-green-400/10 dark:text-green-400 dark:ring-green-400/20"
                                        >
                                            {tool.name}
                                            <button
                                                onClick={() => handleRemoveTool(tool.id)}
                                                className="ml-1 hover:text-green-800 dark:hover:text-green-200"
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Add Tool Button or Search Input */}
                        {!isAdding ? (
                            <Button
                                variant="secondary"
                                onClick={() => setIsAdding(true)}
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Tool
                            </Button>
                        ) : (
                            <div className="space-y-3">
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
                                        />
                                        {isSearching && (
                                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Search Results Dropdown */}
                                    {showResults && searchResults.length > 0 && (
                                        <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto transition-all duration-200 ease-out">
                                            {searchResults.map((tool) => (
                                                <button
                                                    key={tool.id}
                                                    onClick={() => handleAddTool(tool)}
                                                    className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-600 last:border-b-0 transition-colors"
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
                                    )}

                                    {/* No Results */}
                                    {showResults && searchQuery.length >= 2 && searchResults.length === 0 && !isSearching && (
                                        <div className="w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg transition-all duration-200 ease-out">
                                            <div className="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                                No tools found for &quot;{searchQuery}&quot;
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-2">
                                    <Button
                                        variant="secondary"
                                        onClick={() => {
                                            setIsAdding(false)
                                            setSearchQuery('')
                                            setShowResults(false)
                                        }}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
} 