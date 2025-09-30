import { motion } from 'framer-motion'

interface PulsatingDotsProps {
    color?: string
    size?: number
}

export default function PulsatingDots({
    color = "bg-gray-900 dark:bg-gray-50",
    size = 3
}: PulsatingDotsProps) {
    return (
        <div className="flex items-center justify-center">
            <div className="flex space-x-2">
                <motion.div
                    className={`h-${size} w-${size} rounded-full ${color}`}
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1,
                        ease: 'easeInOut',
                        repeat: Infinity,
                    }}
                />
                <motion.div
                    className={`h-${size} w-${size} rounded-full ${color}`}
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1,
                        ease: 'easeInOut',
                        repeat: Infinity,
                        delay: 0.3,
                    }}
                />
                <motion.div
                    className={`h-${size} w-${size} rounded-full ${color}`}
                    animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                        duration: 1,
                        ease: 'easeInOut',
                        repeat: Infinity,
                        delay: 0.6,
                    }}
                />
            </div>
        </div>
    )
} 