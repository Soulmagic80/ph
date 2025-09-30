import { motion } from 'framer-motion'

const tabs = ['Week', 'Month', 'All Time']

// Mapping between display values and internal filter values
const tabMapping: Record<string, string> = {
    'Week': 'week',
    'Month': 'month',
    'All Time': 'all_time'
}

const reverseTabMapping: Record<string, string> = {
    'week': 'Week',
    'month': 'Month',
    'all_time': 'All Time'
}

interface TabProps {
    text: string
    selected: boolean
    setSelected: (text: string) => void
}

const Tab = ({ text, selected, setSelected }: TabProps) => {
    return (
        <button
            onClick={() => setSelected(text)}
            className={`${selected
                ? 'text-white'
                : 'text-gray-900 dark:text-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800/80'
                } relative rounded-md px-3 py-2 text-base sm:text-sm font-medium transition-colors`}
        >
            <span className="relative z-10">{text}</span>
            {selected && (
                <motion.span
                    layoutId="tab"
                    transition={{ type: 'spring', duration: 0.4 }}
                    className="absolute inset-0 z-0 rounded-md bg-pink-100 dark:bg-pinkdark-200"
                ></motion.span>
            )}
        </button>
    )
}

interface ButtonTabsProps {
    selected: 'week' | 'month' | 'all_time'
    onSelectionChange: (tab: 'week' | 'month' | 'all_time') => void
}

export function ButtonTabs({ selected, onSelectionChange }: ButtonTabsProps) {
    // Convert internal filter value to display value
    const displaySelected = reverseTabMapping[selected] || 'All Time'

    const handleSelectionChange = (displayValue: string) => {
        // Convert display value to internal filter value
        const internalValue = tabMapping[displayValue] || 'all_time'
        onSelectionChange(internalValue as 'week' | 'month' | 'all_time')
    }

    return (
        <div className="flex flex-wrap items-center gap-2">
            {tabs.map((tab) => (
                <Tab
                    text={tab}
                    selected={displaySelected === tab}
                    setSelected={handleSelectionChange}
                    key={tab}
                />
            ))}
        </div>
    )
} 