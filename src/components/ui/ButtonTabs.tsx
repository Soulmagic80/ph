import { motion } from 'framer-motion'

interface TabProps {
    text: string
    selected: boolean
    setSelected: (id: string) => void
    id: string
    layoutId: string
}

const Tab = ({ text, selected, setSelected, id, layoutId }: TabProps) => {
    return (
        <button
            onClick={() => setSelected(id)}
            className={`${selected
                ? 'text-white dark:text-white'
                : 'text-gray-900 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800/80'
                } relative rounded-md px-3 py-2 text-base sm:text-sm font-medium transition-colors`}
        >
            <span className="relative z-10">{text}</span>
            {selected && (
                <motion.span
                    layoutId={layoutId}
                    transition={{ type: 'spring', duration: 0.4 }}
                    className="absolute inset-0 z-0 rounded-md bg-[#F72585]"
                ></motion.span>
            )}
        </button>
    )
}

interface ButtonTabsProps {
    tabs: Array<{ id: string; label: string }>
    activeTab: string
    onTabChange: (tabId: string) => void
    layoutId?: string
}

export function ButtonTabs({ tabs, activeTab, onTabChange, layoutId = 'tab' }: ButtonTabsProps) {
    return (
        <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => (
                <Tab
                    key={tab.id}
                    id={tab.id}
                    text={tab.label}
                    selected={activeTab === tab.id}
                    setSelected={onTabChange}
                    layoutId={layoutId}
                />
            ))}
        </div>
    )
} 